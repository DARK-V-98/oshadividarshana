
"use client";

import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser } from "@/firebase/auth/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, AlertTriangle, Package, History } from "lucide-react";
import type { Order } from "@/lib/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
    const variant = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      rejected: "destructive",
    }[status] as "secondary" | "default" | "destructive";

    const className = {
        pending: "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-500/30",
        processing: "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30",
        completed: "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30",
        rejected: "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30",
    }[status]

    return (
        <Badge variant="outline" className={`font-semibold ${className}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

const OrderList = ({ orders, title, description }: { orders: Order[], title: string, description: string }) => {
    if (orders.length === 0) {
        return (
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">{title === "Current Orders" ? <Package /> : <History /> } {title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">No orders found in this category.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">{title === "Current Orders" ? <Package /> : <History /> } {title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {orders.map(order => (
                        <AccordionItem value={order.id} key={order.id}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4 items-center">
                                    <div className="flex flex-col text-left">
                                        <span className="font-semibold">{order.orderCode}</span>
                                        <span className="text-sm text-muted-foreground">{format(order.createdAt.toDate(), "PPP")}</span>
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                    <span className="font-semibold">Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold mb-2">Items:</h4>
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
                    ))}
                 </Accordion>
            </CardContent>
        </Card>
    )
}

export default function MyOrders() {
  const { user, loading: userLoading } = useUser();
  
  const { data: orders, loading: ordersLoading } = useCollection<Order>(
    user ? 'orders' : undefined,
    user ? { where: ['userId', '==', user.uid] } : undefined
  );

  const isLoading = userLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Please Sign In</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You need to be logged in to see your orders.</p>
            </CardContent>
        </Card>
    );
  }

  const sortedOrders = orders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
  const currentOrders = sortedOrders.filter(o => o.status === 'pending' || o.status === 'processing');
  const orderHistory = sortedOrders.filter(o => o.status === 'completed' || o.status === 'rejected');

  return (
    <div className="space-y-8">
        <OrderList orders={currentOrders} title="Current Orders" description="Orders that are pending payment or being processed." />
        <OrderList orders={orderHistory} title="Order History" description="Your past completed and rejected orders." />
    </div>
  );
}

