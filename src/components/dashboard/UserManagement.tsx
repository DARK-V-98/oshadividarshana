
"use client";

import { useState } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile, Order } from "@/lib/types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import MyOrders from "./MyOrders";
import { downloadCSV } from "@/lib/utils";


const UserDetailsDialog = ({ user }: { user: UserProfile }) => {
    const { toast } = useToast();

    const handlePasswordReset = async () => {
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast({
                title: "Password Reset Email Sent",
                description: `An email has been sent to ${user.email} with instructions to reset their password.`,
            });
        } catch (error: any) {
            console.error("Password reset error:", error);
            toast({
                variant: "destructive",
                title: "Failed to Send Email",
                description: error.message,
            });
        }
    };
    
    return (
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>{user.displayName}</DialogTitle>
                <DialogDescription>{user.email}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-4">
                <MyOrders userId={user.uid} />
            </div>
            <DialogFooter>
                 <Button onClick={handlePasswordReset} variant="outline">
                    Send Password Reset
                </Button>
                <DialogClose asChild>
                    <Button type="button">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

export default function UserManagement() {
  const firestore = useFirestore();
  const { data: users, loading } = useCollection<UserProfile>("users");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { userProfile } = useUser();

  const handleRoleChange = async (uid: string, role: "user" | "admin") => {
    if (!firestore) return;
    const userDocRef = doc(firestore, "users", uid);
    try {
      await updateDoc(userDocRef, { role });
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
    }
  };

    const handleExport = () => {
        const dataToExport = filteredUsers.map(user => ({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
        }));
        downloadCSV(dataToExport, 'users_export');
    };

  const filteredUsers = users.filter((user) =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isAdmin = userProfile?.role === 'admin';

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage user permissions.</CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
             <Button onClick={handleExport} variant="outline" size="sm" disabled={loading}>
                Export to CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <Dialog key={user.uid}>
                      <DialogTrigger asChild>
                          <TableRow className="cursor-pointer">
                              <TableCell>{user.displayName}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                              <Select
                                  value={user.role}
                                  onValueChange={(value: "user" | "admin") =>
                                  handleRoleChange(user.uid, value)
                                  }
                                  disabled={!isAdmin}
                                  // Prevent dialog from opening when select is clicked
                                  onClick={(e) => e.stopPropagation()}
                              >
                                  <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                              </Select>
                              </TableCell>
                          </TableRow>
                      </DialogTrigger>
                      <UserDetailsDialog user={user} />
                  </Dialog>
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

    