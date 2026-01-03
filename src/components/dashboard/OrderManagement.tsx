
"use client";

import { useState } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";
import { Loader2, Receipt } from "lucide-react";

export default function OrderManagement() {
  const firestore = useFirestore();
  const { data: orders, loading } = useCollection<Order>("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const { toast } = useToast();
  const { idToken } = useUser();

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    if (!firestore || !idToken) return;
    
    setProcessingOrder(orderId);
    
    try {
        if (status === 'completed') {
             const response = await fetch('/api/create-user-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ orderId }),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create user files.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
        } else {
            // If status is not 'completed', just update the status
            const orderDocRef = doc(firestore, "orders", orderId);
            await updateDoc(orderDocRef, { status });
        }
        
        toast({
          title: "Success",
          description: "Order status updated successfully.",
        });
    } catch (error: any) {
        console.error("Error updating status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update order status.",
        });
    } finally {
        setProcessingOrder(null);
    }
  };

  const filteredOrders = (orders || []).filter((order) =>
    order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage all customer orders.</CardDescription>
        <div className="mt-4">
            <Input
                placeholder="Search by Order Code, Name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Accordion type="single" collapsible className="w-full">
              {loading ? (
                  <p>Loading orders...</p>
              ) : (
                  filteredOrders.map(order => (
                      <AccordionItem value={order.id} key={order.id}>
                          <AccordionTrigger>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm w-full pr-4 text-left">
                                  <div className="flex flex-col">
                                      <span className="font-semibold">{order.orderCode}</span>
                                      <span className="text-xs text-muted-foreground truncate">{order.userDisplayName}</span>
                                  </div>
                                  <span className="hidden md:block text-muted-foreground">{format(order.createdAt.toDate(), "PP")}</span>
                                  <span className={
                                      order.status === 'completed' ? 'text-green-600' :
                                      order.status === 'pending' ? 'text-orange-500' :
                                      order.status === 'processing' ? 'text-blue-500' : 'text-red-500'
                                  }>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                  <span className="font-semibold text-right">Rs. {order.total.toLocaleString()}</span>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent>
                             <div className="p-4 bg-muted/50 rounded-lg">
                                  <p><strong>Order ID:</strong> {order.orderCode}</p>
                                  <p><strong>User:</strong> {order.userDisplayName} ({order.userEmail})</p>
                                  <p><strong>Date:</strong> {format(order.createdAt.toDate(), "PPP p")}</p>
                                  <div className="my-2 flex flex-wrap items-end gap-4">
                                      <div>
                                          <strong>Status:</strong>
                                          <Select
                                              value={order.status}
                                              onValueChange={(value: Order['status']) =>
                                                  handleStatusChange(order.id, value)
                                              }
                                              disabled={processingOrder === order.id}
                                              >
                                              <SelectTrigger className="w-[180px] mt-1">
                                                  {processingOrder === order.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <SelectValue placeholder="Change status" />}
                                              </SelectTrigger>
                                              <SelectContent>
                                                  <SelectItem value="pending">Pending</SelectItem>
                                                  <SelectItem value="processing">Processing</SelectItem>
                                                  <SelectItem value="completed">Completed</SelectItem>
                                                  <SelectItem value="rejected">Rejected</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <Button
                                          size="sm"
                                          disabled={order.status !== 'completed'}
                                          onClick={() => window.open(`/receipt/${order.id}`, '_blank')}
                                      >
                                          <Receipt className="mr-2 h-4 w-4" />
                                          Generate Receipt
                                      </Button>
                                  </div>
                                  <h4 className="font-semibold mt-4 mb-2">Items:</h4>
                                  <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item Name</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.itemName} ({item.unitCode})</TableCell>
                                                    <TableCell className="text-right">Rs. {item.price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                  </div>
                             </div>
                          </AccordionContent>
                      </AccordionItem>
                  ))
              )}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
