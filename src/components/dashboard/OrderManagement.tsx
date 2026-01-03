
"use client";

import { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";
import { Loader2, Receipt } from "lucide-react";
import ReceiptView from "./ReceiptView";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { Checkbox } from "../ui/checkbox";
import { downloadCSV } from "@/lib/utils";

export default function OrderManagement() {
  const firestore = useFirestore();
  const { data: orders, loading } = useCollection<Order>("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<Order['status'] | ''>('');


  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    if (!firestore) return;
    
    setProcessingOrder(orderId);
    
    try {
        const orderDocRef = doc(firestore, "orders", orderId);
        await updateDoc(orderDocRef, { status });
        
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

  const filteredOrders = useMemo(() => {
    return (orders || [])
        .filter((order) => {
            const matchesSearch = 
                order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            const matchesDate = !dateRange || (
                (!dateRange.from || new Date(order.createdAt.toDate()) >= dateRange.from) &&
                (!dateRange.to || new Date(order.createdAt.toDate()) <= dateRange.to)
            );
            
            return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    }, [orders, searchTerm, statusFilter, dateRange]);


  const handleBulkUpdate = async () => {
    if (!firestore || selectedOrders.length === 0 || !bulkStatus) return;

    const batch = writeBatch(firestore);
    selectedOrders.forEach(orderId => {
        const orderRef = doc(firestore, 'orders', orderId);
        batch.update(orderRef, { status: bulkStatus });
    });

    try {
        await batch.commit();
        toast({ title: 'Bulk Update Successful', description: `${selectedOrders.length} orders updated to ${bulkStatus}.` });
        setSelectedOrders([]);
        setBulkStatus('');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Bulk Update Failed', description: 'Could not update orders.' });
    }
  };

  const handleExport = () => {
    const dataToExport = filteredOrders.map(order => ({
        orderCode: order.orderCode,
        date: format(order.createdAt.toDate(), "yyyy-MM-dd"),
        user: order.userDisplayName,
        email: order.userEmail,
        total: order.total,
        status: order.status,
        itemCount: order.items.length,
    }));
    downloadCSV(dataToExport, 'orders_export');
  };

  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const handleSelectRow = (orderId: string) => {
    setSelectedOrders(prev => 
        prev.includes(orderId) 
            ? prev.filter(id => id !== orderId) 
            : [...prev, orderId]
    );
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage all customer orders.</CardDescription>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 flex-wrap">
            <Input
                placeholder="Search by Order Code, Name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-full sm:w-[300px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            <Button onClick={handleExport} variant="outline" size="sm" disabled={loading}>
                Export to CSV
            </Button>
        </div>
        {selectedOrders.length > 0 && (
            <div className="mt-4 flex items-center gap-2 p-2 bg-muted rounded-lg">
                <p className="text-sm font-medium">{selectedOrders.length} selected</p>
                <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as Order['status'])}>
                    <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Set status to..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleBulkUpdate} size="sm" disabled={!bulkStatus}>Apply</Button>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
            <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                         <TableHead className="px-4">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={toggleSelectAll}
                                aria-label="Select all"
                            />
                        </TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                 <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">Loading orders...</TableCell>
                        </TableRow>
                    ) : filteredOrders.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">No orders found.</TableCell>
                        </TableRow>
                    ) : (
                        filteredOrders.map(order => (
                            <TableRow key={order.id} data-state={selectedOrders.includes(order.id) && "selected"}>
                                <TableCell className="px-4">
                                    <Checkbox
                                        checked={selectedOrders.includes(order.id)}
                                        onCheckedChange={() => handleSelectRow(order.id)}
                                        aria-label={`Select order ${order.orderCode}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{order.orderCode}</TableCell>
                                <TableCell>{format(order.createdAt.toDate(), "PP")}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.userDisplayName}</span>
                                        <span className="text-xs text-muted-foreground">{order.userEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>Rs. {order.total.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                                        disabled={processingOrder === order.id}
                                    >
                                        <SelectTrigger className="w-[120px] h-8 text-xs">
                                            {processingOrder === order.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <SelectValue placeholder="Change status" />}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                 <TableCell>
                                     <Dialog>
                                        <DialogTrigger asChild>
                                                <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={order.status !== 'completed'}
                                            >
                                                <Receipt className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-3xl">
                                            <DialogHeader>
                                            <DialogTitle>Receipt for Order {order.orderCode}</DialogTitle>
                                            </DialogHeader>
                                            <ReceiptView order={order} />
                                        </DialogContent>
                                    </Dialog>
                                 </TableCell>
                            </TableRow>
                        ))
                    )}
                 </TableBody>
            </Table>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    