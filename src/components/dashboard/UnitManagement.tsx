
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore } from "@/firebase";
import { collection, writeBatch, doc, updateDoc } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import { moduleCategories, pricingData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
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
import { Upload, FileText, XCircle } from "lucide-react";
import type { Unit } from "@/lib/types";


const unitFormSchema = z.object({
  category: z.string().min(1, "Category is required."),
  code: z.string().min(1, "Module code is required."),
  title: z.string().min(1, "English title is required."),
  sinhalaTitle: z.string().min(1, "Sinhala title is required."),
});

const priceFormSchema = z.object({
    priceSinhalaNote: z.coerce.number().min(0, "Price must be non-negative."),
    priceSinhalaAssignment: z.coerce.number().min(0, "Price must be non-negative."),
    priceEnglishNote: z.coerce.number().min(0, "Price must be non-negative."),
    priceEnglishAssignment: z.coerce.number().min(0, "Price must be non-negative."),
});

const getPriceForUnit = (categoryName: string, type: 'Note' | 'Assignment', medium: 'sinhala' | 'english'): number => {
    const categoryPricing = pricingData.find(p => p.name === categoryName);
    if (!categoryPricing) return 0;
    
    const mediumPricing = categoryPricing[medium];
    const individualItem = mediumPricing.find(item => item.type === 'individual' && item.label.toLowerCase() === type.toLowerCase());

    return individualItem?.price || 0;
}


const UnitManager = ({ unit }: { unit: Unit }) => {
    const [open, setOpen] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof priceFormSchema>>({
        resolver: zodResolver(priceFormSchema),
        defaultValues: {
            priceSinhalaNote: unit.priceSinhalaNote || 0,
            priceSinhalaAssignment: unit.priceSinhalaAssignment || 0,
            priceEnglishNote: unit.priceEnglishNote || 0,
            priceEnglishAssignment: unit.priceEnglishAssignment || 0,
        },
    });

    const handlePriceUpdate = async (values: z.infer<typeof priceFormSchema>) => {
        if (!firestore) return;
        const unitDocRef = doc(firestore, "units", unit.id);
        try {
            await updateDoc(unitDocRef, values);
            toast({ title: "Success", description: "Prices updated successfully." });
            setOpen(false);
        } catch (error) {
            console.error("Error updating prices:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update prices." });
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manage Unit: {unit.code}</DialogTitle>
                    <DialogDescription>{unit.title}</DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePriceUpdate)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sinhala Medium */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="font-semibold text-lg">Sinhala Medium</h3>
                                <FormField
                                    control={form.control}
                                    name="priceSinhalaNote"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Note Price (Rs.)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Note PDF:</span>
                                    {unit.pdfUrlSinhalaNote ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <FileText className="h-4 w-4" />
                                            <span>Uploaded</span>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "PDF upload will be available soon."})}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload
                                        </Button>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="priceSinhalaAssignment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assignment Price (Rs.)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Assignment PDF:</span>
                                    {unit.pdfUrlSinhalaAssignment ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <FileText className="h-4 w-4" />
                                            <span>Uploaded</span>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "PDF upload will be available soon."})}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            {/* English Medium */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="font-semibold text-lg">English Medium</h3>
                                <FormField
                                    control={form.control}
                                    name="priceEnglishNote"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Note Price (Rs.)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Note PDF:</span>
                                    {unit.pdfUrlEnglishNote ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <FileText className="h-4 w-4" />
                                            <span>Uploaded</span>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "PDF upload will be available soon."})}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload
                                        </Button>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="priceEnglishAssignment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assignment Price (Rs.)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Assignment PDF:</span>
                                    {unit.pdfUrlEnglishAssignment ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <FileText className="h-4 w-4" />
                                            <span>Uploaded</span>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "PDF upload will be available soon."})}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Prices</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

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
    if (units.length > 0) {
        toast({
            variant: "destructive",
            title: "Already Seeded",
            description: "Units have already been seeded.",
        });
        return;
    }

    const batch = writeBatch(firestore);
    moduleCategories.forEach(category => {
        const categoryName = category.name;
        category.modules.forEach(module => {
            const unitDocRef = doc(collection(firestore, "units"));
            const newUnit: Omit<Unit, 'id'> = {
                category: category.id,
                code: module.code,
                title: module.title,
                sinhalaTitle: module.sinhala,
                priceSinhalaNote: getPriceForUnit(categoryName, 'Note', 'sinhala'),
                priceSinhalaAssignment: getPriceForUnit(categoryName, 'Assignment', 'sinhala'),
                priceEnglishNote: getPriceForUnit(categoryName, 'Note', 'english'),
                priceEnglishAssignment: getPriceForUnit(categoryName, 'Assignment', 'english'),
                pdfUrlSinhalaNote: null,
                pdfUrlSinhalaAssignment: null,
                pdfUrlEnglishNote: null,
                pdfUrlEnglishAssignment: null,
            };
            batch.set(unitDocRef, newUnit);
        });
    });

    try {
        await batch.commit();
        toast({
            title: "Success",
            description: "Units have been seeded successfully with default prices.",
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

  return (
     <div className="grid grid-cols-1 gap-8">
        <div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Manage Units</CardTitle>
                            <CardDescription>Seed or view existing units. Click 'Manage' to edit prices and upload files.</CardDescription>
                        </div>
                        <Button onClick={handleSeedUnits} variant="outline" size="sm" disabled={units.length > 0 && !loading}>
                          {loading ? 'Loading...' : units.length > 0 ? 'Already Seeded' : 'Seed Units & Prices'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading units...</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {moduleCategories.map((category) => {
                                const categoryUnits = units.filter(u => u.category === category.id).sort((a,b) => a.code.localeCompare(b.code));
                                if(categoryUnits.length === 0) return null;
                                
                                return (
                                <AccordionItem value={category.id} key={category.id}>
                                    <AccordionTrigger>
                                        <span className="font-semibold">{category.name} ({categoryUnits.length})</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Code</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {categoryUnits.map((unit) => (
                                                    <TableRow key={unit.id}>
                                                        <TableCell className="font-medium">{unit.code}</TableCell>
                                                        <TableCell>{unit.title}</TableCell>
                                                        <TableCell className="text-right">
                                                            <UnitManager unit={unit} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            )})}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
     </div>
  );
}
