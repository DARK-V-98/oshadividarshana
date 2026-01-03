
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/dashboard/UserManagement";
import UnitManagement from "@/components/dashboard/UnitManagement";
import OrderManagement from "@/components/dashboard/OrderManagement";
import MyContent from "@/components/dashboard/MyContent";
import MyOrders from "@/components/dashboard/MyOrders";

export default function DashboardPage() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }
  
  const isAdmin = userProfile.role === 'admin';

  return (
    <main className="container my-12 md:my-24 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          Dashboard
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Welcome back, {userProfile.displayName}!
        </p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className={`grid w-full h-auto ${isAdmin ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2'}`}>
          <TabsTrigger value="content" className="py-2">My Unlocked Content</TabsTrigger>
          <TabsTrigger value="orders" className="py-2">My Orders</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="admin-orders" className="py-2">Order Management</TabsTrigger>
              <TabsTrigger value="users" className="py-2">User Management</TabsTrigger>
              <TabsTrigger value="units" className="py-2">Unit Management</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="content">
            <MyContent />
        </TabsContent>
         <TabsContent value="orders">
            <MyOrders />
        </TabsContent>
        {isAdmin && (
          <>
            <TabsContent value="admin-orders">
                <OrderManagement />
            </TabsContent>
            <TabsContent value="users">
                <UserManagement />
            </TabsContent>
            <TabsContent value="units">
              <UnitManagement />
            </TabsContent>
          </>
        )}
      </Tabs>
    </main>
  );
}
