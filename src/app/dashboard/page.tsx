
"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/dashboard/UserManagement";
import UnitManagement from "@/components/dashboard/UnitManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="units">Unit Management</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Your purchased study materials will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <p>No courses purchased yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {isAdmin && (
          <>
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
