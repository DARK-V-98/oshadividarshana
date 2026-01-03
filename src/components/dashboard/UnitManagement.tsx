
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
import { Trash2 } from "lucide-react";
import type { Unit } from "@/lib/types";
import FileUpload from "./FileUpload";

const unitDetailsSchema = z.object({
    title: z.string().min(3, "English title must be at least 3 characters."),
    sinhalaTitle: z.string().min(3, "Sinhala title must be at least 3 characters."),
    priceSinhalaNote: z.coerce.number().min(0, "Price must be non-negative."),
    priceSinhalaAssignment: z.coerce.number().min(0, "Price must be non-negative."),
    priceEnglishNote: z.coerce.number().min(0, "Price must be non-negative."),
    priceEnglishAssignment: z.coerce.number().min(0, "Price must be non-negative."),
});

const getPriceForUnit = (categoryName: string, type: 'Note' | 'Assignment', medium: 'sinhala' | 'english'): number => {
    const categoryPricing = pricingData.find(p => p.name === categoryName);
    if (!categoryPricing) return 0;
    
    const mediumPricing = categoryPricing[medium];
    const individualItem = mediumPricing.find(item => item.type === 'individualNote' || item.type === 'individualAssignment');

    return individualItem?.price || 0;
}


const UnitManager = ({ unit }: { unit: Unit }) => {
    const [open, setOpen] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof unitDetailsSchema>>({
        resolver: zodResolver(unitDetailsSchema),
        defaultValues: {
            title: unit.title || '',
            sinhalaTitle: unit.sinhalaTitle || '',
            priceSinhalaNote: unit.priceSinhalaNote || 0,
            priceSinhalaAssignment: unit.priceSinhalaAssignment || 0,
            priceEnglishNote: unit.priceEnglishNote || 0,
            priceEnglishAssignment: unit.priceEnglishAssignment || 0,
        },
    });

    const handleDetailsUpdate = async (values: z.infer<typeof unitDetailsSchema>) => {
        if (!firestore) return;
        const unitDocRef = doc(firestore, "units", unit.id);
        try {
            await updateDoc(unitDocRef, values);
            toast({ title: "Success", description: "Unit details updated successfully." });
            setOpen(false);
        } catch (error) {
            console.error("Error updating details:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update details." });
        }
    };

    const handleUrlUpdate = async (field: keyof Unit, url: string | null) => {
        if (!firestore) return;
        const unitDocRef = doc(firestore, "units", unit.id);
        try {
            await updateDoc(unitDocRef, { [field]: url });
            toast({ title: "Success", description: "File URL updated." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update file URL." });
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Manage Unit: {unit.code}</DialogTitle>
                    <DialogDescription>{unit.title}</DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleDetailsUpdate)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>English Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                <div className="space-y-1">
                                    <span className="text-sm font-medium">Note PDF:</span>
                                    <FileUpload 
                                        filePath={`units/${unit.id}/sinhala-note.pdf`}
                                        onUploadComplete={(url) => handleUrlUpdate('pdfUrlSinhalaNote', url)}
                                        onDelete={() => handleUrlUpdate('pdfUrlSinhalaNote', null)}
                                        currentFileUrl={unit.pdfUrlSinhalaNote}
                                    />
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
                                <div className="space-y-1">
                                    <span className="text-sm font-medium">Assignment PDF:</span>
                                    <FileUpload 
                                        filePath={`units/${unit.id}/sinhala-assignment.pdf`}
                                        onUploadComplete={(url) => handleUrlUpdate('pdfUrlSinhalaAssignment', url)}
                                        onDelete={() => handleUrlUpdate('pdfUrlSinhalaAssignment', null)}
                                        currentFileUrl={unit.pdfUrlSinhalaAssignment}
                                    />
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
                                <div className="space-y-1">
                                    <span className="text-sm font-medium">Note PDF:</span>
                                     <FileUpload 
                                        filePath={`units/${unit.id}/english-note.pdf`}
                                        onUploadComplete={(url) => handleUrlUpdate('pdfUrlEnglishNote', url)}
                                        onDelete={() => handleUrlUpdate('pdfUrlEnglishNote', null)}
                                        currentFileUrl={unit.pdfUrlEnglishNote}
                                    />
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
                                <div className="space-y-1">
                                    <span className="text-sm font-medium">Assignment PDF:</span>
                                    <FileUpload 
                                        filePath={`units/${unit.id}/english-assignment.pdf`}
                                        onUploadComplete={(url) => handleUrlUpdate('pdfUrlEnglishAssignment', url)}
                                        onDelete={() => handleUrlUpdate('pdfUrlEnglishAssignment', null)}
                                        currentFileUrl={unit.pdfUrlEnglishAssignment}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
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

const UploadStatusIndicator = ({ unit }: { unit: Unit }) => {
    const uploadedCount = [
        unit.pdfUrlSinhalaNote,
        unit.pdfUrlSinhalaAssignment,
        unit.pdfUrlEnglishNote,
        unit.pdfUrlEnglishAssignment
    ].filter(Boolean).length;

    return (
        <div className="flex items-center gap-1" title={`${uploadedCount} of 4 files uploaded`}>
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${index < uploadedCount ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
            ))}
        </div>
    );
};

export default function UnitManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { data: units, loading, error } = useCollection<Unit>("units");

  const handleSeedUnits = () => {
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

  return (
     <div className="grid grid-cols-1 gap-8">
        <div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Manage Units</CardTitle>
                            <CardDescription>Seed or view existing units. Click 'Manage' to edit prices and upload files.</CardDescription>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <Button onClick={handleSeedUnits} variant="outline" size="sm" disabled={units.length > 0 || loading}>
                            {loading ? 'Loading...' : units.length > 0 ? 'Already Seeded' : 'Seed Units & Prices'}
                            </Button>
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={units.length === 0 || loading}>
                                        <Trash2 className="mr-0 sm:mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Delete All</span>
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
                                        <div className="flex flex-col gap-3">
                                            {categoryUnits.map((unit) => (
                                                 <div key={unit.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border bg-muted/50 gap-2">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{unit.code}: {unit.title}</p>
                                                        <p className="text-sm text-muted-foreground">{unit.sinhalaTitle}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                                        <UploadStatusIndicator unit={unit} />
                                                        <UnitManager unit={unit} />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <DeleteUnitConfirmation unitId={unit.id} onDeleted={() => {}} />
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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

    