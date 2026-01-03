
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/dashboard/UserManagement";
import UnitManagement from "@/components/dashboard/UnitManagement";
import OrderManagement from "@/components/dashboard/OrderManagement";
import MyContent from "@/components/dashboard/MyContent";
import MyOrders from "@/components/dashboard/MyOrders";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import SiteSettings from "@/components/dashboard/SiteSettings";
import UserProfile from "@/components/dashboard/UserProfile";
import ManualOrderManagement from "@/components/dashboard/ManualOrderManagement";

export default function DashboardPage() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || (userProfile?.role === 'admin' ? 'overview' : 'content');
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (loading || !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const isAdmin = userProfile.role === 'admin';

  const adminTabs = [
    { value: "overview", label: "Overview" },
    { value: "admin-orders", label: "Order Management" },
    { value: "manual-orders", label: "Manual Orders" },
    { value: "users", label: "User Management" },
    { value: "units", label: "Unit Management" },
    { value: "site-settings", label: "Site Settings" },
    { value: "profile", label: "My Profile" },
    { value: "content", label: "My Unlocked Content" },
    { value: "orders", label: "My Orders" },
  ];

  const userTabs = [
    { value: "content", label: "My Unlocked Content" },
    { value: "orders", label: "My Orders" },
    { value: "profile", label: "My Profile" },
  ];

  const tabsToShow = isAdmin ? adminTabs : userTabs;

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full h-auto grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2">
            {tabsToShow.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="py-2 data-[state=active]:shadow-md data-[state=active]:border-border border border-transparent">{tab.label}</TabsTrigger>
            ))}
        </TabsList>
        
        {/* Common Tabs */}
        <TabsContent value="content">
            <MyContent />
        </TabsContent>
         <TabsContent value="orders">
            <MyOrders />
        </TabsContent>
        <TabsContent value="profile">
            <UserProfile />
        </TabsContent>
        
        {/* Admin Tabs */}
        {isAdmin && (
          <>
            <TabsContent value="overview">
                <DashboardOverview />
            </TabsContent>
            <TabsContent value="admin-orders">
                <OrderManagement />
            </TabsContent>
            <TabsContent value="manual-orders">
                <ManualOrderManagement />
            </TabsContent>
            <TabsContent value="users">
                <UserManagement />
            </TabsContent>
            <TabsContent value="units">
              <UnitManagement />
            </TabsContent>
             <TabsContent value="site-settings">
              <SiteSettings />
            </TabsContent>
          </>
        )}
      </Tabs>
    </main>
  );
}
