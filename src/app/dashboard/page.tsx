
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package, Users, Settings, User, BarChart, ShoppingCart, KeyRound, BookOpen, FileText } from "lucide-react";
import UserManagement from "@/components/dashboard/UserManagement";
import UnitManagement from "@/components/dashboard/UnitManagement";
import OrderManagement from "@/components/dashboard/OrderManagement";
import MyContent from "@/components/dashboard/MyContent";
import MyOrders from "@/components/dashboard/MyOrders";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import SiteSettings from "@/components/dashboard/SiteSettings";
import UserProfile from "@/components/dashboard/UserProfile";
import ManualOrderManagement from "@/components/dashboard/ManualOrderManagement";
import { Card } from "@/components/ui/card";
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
    <main className="container my-12 md:my-24 min-h-screen">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          Dashboard
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Welcome back, {userProfile.displayName}!
        </p>
      </div>
      
      <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
        <nav className="hidden md:flex flex-col gap-2 sticky top-24">
            {tabsToShow.map(tab => (
                 <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        activeTab === tab.value && "bg-muted text-primary font-medium"
                    )}
                >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                </button>
            ))}
        </nav>

        <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {tabsToShow.map((tab) => (
                <Card
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                        "p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                        activeTab === tab.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                >
                    <tab.icon className="h-6 w-6" />
                    <span className="text-sm font-medium text-center">{tab.label}</span>
                </Card>
            ))}
        </div>
        
        <div className="md:col-start-2">
            {renderContent()}
        </div>
      </div>
    </main>
  );
}
