
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore } from "@/firebase";
import { collection, writeBatch, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Upload, FileText, XCircle, AlertTriangle, Trash2 } from "lucide-react";
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
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Manage Unit: {unit.code}</DialogTitle>
                    <DialogDescription>{unit.title}</DialogDescription>
                </DialogHeader>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-sm font-medium">PDF upload requires Firebase Storage setup. This feature is not yet active.</p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePriceUpdate)} className="space-y-6">
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
                                        <Button size="sm" variant="outline" type="button" disabled>
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
                                        <Button size="sm" variant="outline" type="button" disabled>
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
                                        <Button size="sm" variant="outline" type="button" disabled>
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
                                        <Button size="sm" variant="outline" type="button" disabled>
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

const DeleteUnitConfirmation = ({ unitId, onDeleted }: { unitId: string; onDeleted: () => void }) => {
    const [confirmText, setConfirmText] = useState("");
    const [step, setStep] = useState(1);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, "units", unitId));
            toast({ title: "Unit deleted successfully." });
            onDeleted();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete unit." });
        }
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                {step === 1 ? (
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the unit and all associated data.
                    </AlertDialogDescription>
                ) : (
                    <AlertDialogDescription>
                        This is the final confirmation. To proceed, please type `DELETE` in the box below.
                    </AlertDialogDescription>
                )}
            </AlertDialogHeader>
            {step === 2 && (
                 <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder='Type DELETE to confirm'
                />
            )}
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setStep(1)}>Cancel</AlertDialogCancel>
                {step === 1 ? (
                    <AlertDialogAction onClick={() => setStep(2)} className="bg-destructive hover:bg-destructive/90">
                        Continue
                    </AlertDialogAction>
                ) : (
                    <AlertDialogAction onClick={handleDelete} disabled={confirmText !== 'DELETE'} className="bg-destructive hover:bg-destructive/90">
                        Delete Unit
                    </AlertDialogAction>
                )}
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

const DeleteAllUnitsConfirmation = ({ onDeleted }: { onDeleted: () => void }) => {
    const [confirmText, setConfirmText] = useState("");
    const [step, setStep] = useState(1);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDeleteAll = async () => {
        if (!firestore) return;
        const batch = writeBatch(firestore);
        const unitsSnapshot = await getDocs(collection(firestore, "units"));
        unitsSnapshot.forEach(doc => batch.delete(doc.ref));
        try {
            await batch.commit();
            toast({ title: "All units deleted successfully." });
            onDeleted();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete all units." });
        }
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete ALL units?</AlertDialogTitle>
                 {step === 1 ? (
                    <AlertDialogDescription>
                       This is a highly destructive action that cannot be undone. It will permanently delete all units.
                    </AlertDialogDescription>
                ) : (
                    <AlertDialogDescription>
                       To confirm, please type `DELETE ALL` in the box below.
                    </AlertDialogDescription>
                )}
            </AlertDialogHeader>
            {step === 2 && (
                 <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder='Type DELETE ALL to confirm'
                />
            )}
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setStep(1)}>Cancel</AlertDialogCancel>
                {step === 1 ? (
                    <AlertDialogAction onClick={() => setStep(2)} className="bg-destructive hover:bg-destructive/90">
                        Yes, I'm sure
                    </AlertDialogAction>
                ) : (
                    <AlertDialogAction onClick={handleDeleteAll} disabled={confirmText !== 'DELETE ALL'} className="bg-destructive hover:bg-destructive/90">
                        Delete All Units
                    </AlertDialogAction>
                )}
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

export default function UnitManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { data: units, loading, error } = useCollection<Unit>("units");

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
                        <div className="flex gap-2">
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button onClick={handleSeedUnits} variant="outline" size="sm" disabled={units.length > 0 && !loading}>
                                    {loading ? 'Loading...' : units.length > 0 ? 'Already Seeded' : 'Seed Units & Prices'}
                                    </Button>
                                </AlertDialogTrigger>
                           </AlertDialog>
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={units.length === 0 || loading}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete All
                                    </Button>
                                </AlertDialogTrigger>
                                <DeleteAllUnitsConfirmation onDeleted={() => {}} />
                           </AlertDialog>
                        </div>
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
                                                        <TableCell className="text-right space-x-2">
                                                            <UnitManager unit={unit} />
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="destructive" size="sm">Delete</Button>
                                                                </AlertDialogTrigger>
                                                                <DeleteUnitConfirmation unitId={unit.id} onDeleted={() => {}} />
                                                            </AlertDialog>
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

  function handleSeedUnits() {
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
        batch.commit();
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
  }
}
