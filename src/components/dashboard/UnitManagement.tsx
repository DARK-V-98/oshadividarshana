"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore } from "@/firebase";
import { collection, addDoc, writeBatch, doc } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import { moduleCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { Unit } from "@/lib/types";


const unitFormSchema = z.object({
  category: z.string().min(1, "Category is required."),
  code: z.string().min(1, "Module code is required."),
  title: z.string().min(1, "English title is required."),
  sinhalaTitle: z.string().min(1, "Sinhala title is required."),
});

export default function UnitManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { data: units, loading } = useCollection<Unit>("units");

  const form = useForm<z.infer<typeof unitFormSchema>>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      category: "",
      code: "",
      title: "",
      sinhalaTitle: "",
    },
  });

  const handleSeedUnits = async () => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    moduleCategories.forEach(category => {
        category.modules.forEach(module => {
            const unitDocRef = doc(collection(firestore, "units"));
            batch.set(unitDocRef, {
                category: category.id,
                code: module.code,
                title: module.title,
                sinhalaTitle: module.sinhala,
            });
        });
    });

    try {
        await batch.commit();
        toast({
            title: "Success",
            description: "Units have been seeded successfully.",
        });
    } catch (error) {
        console.error("Error seeding units:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to seed units.",
        });
    }
  };

  const handleAddUnit = async (values: z.infer<typeof unitFormSchema>) => {
    if (!firestore) return;
    try {
        await addDoc(collection(firestore, "units"), values);
        toast({
            title: "Success",
            description: "New unit added successfully."
        });
        form.reset();
    } catch (error) {
        console.error("Error adding unit:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add new unit.",
        });
    }
  };

  return (
     <div className="grid md:grid-cols-2 gap-8">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Unit</CardTitle>
                    <CardDescription>Manually add a new course unit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddUnit)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="bridal">Bridal Dresser</SelectItem>
                                        <SelectItem value="beauty">Beauty</SelectItem>
                                        <SelectItem value="hair">Hair Dresser</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Module Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., BD-M01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>English Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Analyse Skin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sinhalaTitle"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Sinhala Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., සම විශ්ලේෂණය" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Add Unit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Manage Units</CardTitle>
                            <CardDescription>Seed or view existing units.</CardDescription>
                        </div>
                        <Button onClick={handleSeedUnits} variant="outline" size="sm">Seed Units</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
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
                                units.map((unit) => (
                                    <TableRow key={unit.id}>
                                    <TableCell>{unit.code}</TableCell>
                                    <TableCell>{unit.title}</TableCell>
                                    <TableCell className="capitalize">{unit.category}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
     </div>
  );
}
