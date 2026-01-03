
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package, Users, Settings, User, BarChart, ShoppingCart, KeyRound, BookOpen, FileText, Shield } from "lucide-react";
import UserManagement from "@/components/dashboard/UserManagement";
import UnitManagement from "@/components/dashboard/UnitManagement";
import OrderManagement from "@/components/dashboard/OrderManagement";
import MyContent from "@/components/dashboard/MyContent";
import MyOrders from "@/components/dashboard/MyOrders";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import SiteSettings from "@/components/dashboard/SiteSettings";
import UserProfile from "@/components/dashboard/UserProfile";
import ManualOrderManagement from "@/components/dashboard/ManualOrderManagement";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";


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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (loading || !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const isAdmin = userProfile.role === 'admin';

  const adminTabs = [
    { value: "overview", label: "Overview", icon: BarChart },
    { value: "admin-orders", label: "Order Management", icon: ShoppingCart },
    { value: "manual-orders", label: "Manual Orders", icon: KeyRound },
    { value: "users", label: "User Management", icon: Users },
    { value: "units", label: "Unit Management", icon: BookOpen },
    { value: "site-settings", label: "Site Settings", icon: Settings },
    { value: "profile", label: "My Profile", icon: User },
    { value: "content", label: "My Unlocked Content", icon: FileText },
    { value: "orders", label: "My Orders", icon: Package },
  ];

  const userTabs = [
    { value: "content", label: "My Unlocked Content", icon: FileText },
    { value: "orders", label: "My Orders", icon: Package },
    { value: "profile", label: "My Profile", icon: User },
  ];

  const tabsToShow = isAdmin ? adminTabs : userTabs;

  const renderContent = () => {
    switch (activeTab) {
      // Common
      case 'content': return <MyContent />;
      case 'orders': return <MyOrders />;
      case 'profile': return <UserProfile />;
      // Admin
      case 'overview': return <DashboardOverview />;
      case 'admin-orders': return <OrderManagement />;
      case 'manual-orders': return <ManualOrderManagement />;
      case 'users': return <UserManagement />;
      case 'units': return <UnitManagement />;
      case 'site-settings': return <SiteSettings />;
      default: return isAdmin ? <DashboardOverview /> : <MyContent />;
    }
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.displayName || 'User'} />
                        <AvatarFallback>{getInitials(userProfile.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm truncate">{userProfile.displayName}</span>
                        <span className="text-xs text-muted-foreground truncate">{userProfile.email}</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {tabsToShow.map(tab => (
                        <SidebarMenuItem key={tab.value}>
                            <SidebarMenuButton
                                onClick={() => setActiveTab(tab.value)}
                                isActive={activeTab === tab.value}
                                className="justify-start w-full"
                            >
                                <tab.icon className="h-5 w-5 mr-3" />
                                <span>{tab.label}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    {isAdmin && (
                         <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => router.push('/dashboard?tab=overview')}
                                isActive={false}
                                className="justify-start w-full text-primary hover:text-primary mt-4"
                            >
                                <Shield className="h-5 w-5 mr-3" />
                                <span>Admin View</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <main className="container my-12 md:my-16 min-h-screen">
                <div className="md:hidden flex items-center gap-4 mb-8">
                     <SidebarTrigger />
                     <h1 className="text-2xl font-bold tracking-tighter font-playfair">
                        {tabsToShow.find(t => t.value === activeTab)?.label}
                    </h1>
                </div>
                <div className="hidden md:block text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
                    Dashboard
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                    Welcome back, {userProfile.displayName}!
                    </p>
                </div>
                
                {renderContent()}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
