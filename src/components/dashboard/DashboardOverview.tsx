
'use client';

import { useCollection } from '@/firebase';
import type { Order, UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users, BarChart } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, LineChart, XAxis, YAxis, Tooltip, Bar, Line, CartesianGrid } from 'recharts';
import { subDays, format, startOfDay } from 'date-fns';

const StatsCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function DashboardOverview() {
    const { data: orders, loading: ordersLoading } = useCollection<Order>('orders');
    const { data: users, loading: usersLoading } = useCollection<UserProfile>('users');

    const loading = ordersLoading || usersLoading;

    // Calculate stats
    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((acc, o) => acc + o.total, 0);
    
    const orderStatusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<Order['status'], number>);

    const totalUsers = users.length;
    
    // Prepare chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => startOfDay(subDays(new Date(), i))).reverse();
    
    const salesData = last30Days.map(date => {
        const dateString = format(date, 'MMM dd');
        const dailySales = orders
            .filter(o => o.status === 'completed' && startOfDay(o.createdAt.toDate()).getTime() === date.getTime())
            .reduce((acc, o) => acc + o.total, 0);
        return { date: dateString, Sales: dailySales };
    });

    const userSignupsData = last30Days.map(date => {
        // Note: Firebase doesn't store user creation date in Firestore by default.
        // This chart will be empty unless you add a 'createdAt' field to your user profiles.
        // For now, we'll just show a placeholder.
        return { date: format(date, 'MMM dd'), Users: 0 };
    });

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
                <StatsCard title="Total Users" value={totalUsers.toString()} icon={Users} />
                <StatsCard title="Completed Orders" value={(orderStatusCounts.completed || 0).toString()} icon={Package} />
                <StatsCard title="Pending Orders" value={(orderStatusCounts.pending || 0).toString()} icon={Package} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs.${value/1000}k`} />
                                <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
                                <Line type="monotone" dataKey="Sales" stroke="#E11D48" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>New Users (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <RechartsBarChart data={userSignupsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="Users" fill="#E11D48" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-muted-foreground mt-2">Note: User creation date is not tracked. This chart is a placeholder.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
