
"use client";

import { useState } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { useFirestore } from "@/firebase";
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
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";

export default function OrderManagement() {
  const firestore = useFirestore();
  const { data: orders, loading } = useCollection<Order>("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleStatusChange = async (orderId: string, status: "pending" | "completed") => {
    if (!firestore) return;
    const orderDocRef = doc(firestore, "orders", orderId);
    try {
      await updateDoc(orderDocRef, { status });
      toast({
        title: "Success",
        description: "Order status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status.",
      });
    }
  };

  const filteredOrders = orders.filter((order) =>
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
        <Accordion type="single" collapsible className="w-full">
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                filteredOrders.map(order => (
                    <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between w-full pr-4">
                                <span>{order.orderCode} - {order.userDisplayName}</span>
                                <span className={order.status === 'completed' ? 'text-green-600' : 'text-orange-500'}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <span>Rs. {order.total.toLocaleString()}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="p-4 bg-muted/50 rounded-lg">
                                <p><strong>Order ID:</strong> {order.orderCode}</p>
                                <p><strong>User:</strong> {order.userDisplayName} ({order.userEmail})</p>
                                <p><strong>Date:</strong> {format(order.createdAt.toDate(), "PPP p")}</p>
                                <div className="my-2">
                                    <strong>Status:</strong>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value: "pending" | "completed") =>
                                            handleStatusChange(order.id, value)
                                        }
                                        >
                                        <SelectTrigger className="w-[180px] mt-1">
                                            <SelectValue placeholder="Change status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <h4 className="font-semibold mt-4 mb-2">Items:</h4>
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
                        </AccordionContent>
                    </AccordionItem>
                ))
            )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
