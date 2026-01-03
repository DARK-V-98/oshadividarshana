"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/dashboard/UserManagement";
import UnitManagement from "@/components/dashboard/UnitManagement";

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
    <main className="container my-12 md:my-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          Dashboard
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Welcome back, {userProfile.displayName}!
        </p>
      </div>

      {isAdmin ? (
         <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="units">Unit Management</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
                <UserManagement />
            </TabsContent>
            <TabsContent value="units">
                <UnitManagement />
            </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-card">
            <h2 className="text-2xl font-bold font-playfair mb-2">My Courses</h2>
            <p className="text-muted-foreground">Your purchased study materials will appear here.</p>
            {/* User-specific content will go here in the future */}
        </div>
      )}
    </main>
  );
}
