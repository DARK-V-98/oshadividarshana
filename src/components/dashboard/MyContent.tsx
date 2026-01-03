
"use client";

import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser } from "@/firebase/auth/use-user";
import { useStorage } from "@/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, AlertTriangle, FileText } from "lucide-react";
import type { Order, CartItem, Unit } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const itemTypeToFileName = (itemType: string): string | null => {
    switch (itemType) {
        case 'sinhalaNote': return 'sinhala-note.pdf';
        case 'sinhalaAssignment': return 'sinhala-assignment.pdf';
        case 'englishNote': return 'english-note.pdf';
        case 'englishAssignment': return 'english-assignment.pdf';
        default: return null;
    }
};


const ViewButton = ({ item }: { item: CartItem }) => {
    const { toast } = useToast();
    const storage = useStorage();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleView = async () => {
        if (!storage) {
            toast({ variant: "destructive", title: "Storage Error", description: "Firebase Storage is not available." });
            return;
        }

        const fileName = itemTypeToFileName(item.itemType);
        if (!fileName) {
            toast({ variant: "destructive", title: "Invalid Item", description: "Cannot determine the file for this item." });
            return;
        }
        
        const filePath = `units/${item.unitId}/${fileName}`;

        setIsGenerating(true);
        try {
            const fileRef = ref(storage, filePath);
            const downloadUrl = await getDownloadURL(fileRef);
            window.open(downloadUrl, '_blank');
            
        } catch (error: any) {
            console.error("Download URL error:", error);
             if (error.code === 'storage/object-not-found') {
                 toast({ variant: "destructive", title: "File Not Found", description: "The requested file does not exist. Please contact support." });
            } else if (error.code === 'storage/unauthorized') {
                toast({ variant: "destructive", title: "Permission Denied", description: "You do not have permission to access this file. Please ensure your order is complete." });
            } else {
                toast({ variant: "destructive", title: "Failed to Open", description: "An unexpected error occurred." });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button onClick={handleView} size="sm" disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            View
        </Button>
    );
};


export default function MyContent() {
  const { user, loading: userLoading } = useUser();
  
  const { data: completedOrders, loading: ordersLoading } = useCollection<Order>(
    user ? 'orders' : undefined,
    user ? { where: [['userId', '==', user.uid], ['status', '==', 'completed']] } : undefined
  );
  const { data: allUnits, loading: unitsLoading } = useCollection<Unit>('units');
  
  const purchasedItems = useMemo(() => {
    if (!completedOrders?.length || !allUnits?.length) return [];
    
    const itemsWithDetails: (CartItem & { category: string, title: string, sinhalaTitle: string })[] = [];

    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const unit = allUnits.find(u => u.id === item.unitId);
        itemsWithDetails.push({ 
            ...item,
            category: unit?.category || 'other',
            title: unit?.title || item.title,
            sinhalaTitle: unit?.sinhalaTitle || item.sinhalaTitle,
        });
      });
    });

    // Deduplicate items
    const uniqueItems = Array.from(new Map(itemsWithDetails.map(item => [`${item.unitId}-${item.itemType}`, item])).values());

    const itemsByCategory: Record<string, (CartItem & { title: string, sinhalaTitle: string })[]> = {};
    uniqueItems.forEach(item => {
        const category = (item as any).category || 'other';
        if (!itemsByCategory[category]) {
            itemsByCategory[category] = [];
        }
        itemsByCategory[category].push(item);
    });

    return Object.entries(itemsByCategory).map(([categoryId, items]) => ({
        categoryId,
        items: items.sort((a,b) => a.unitCode.localeCompare(b.unitCode)),
    }));

  }, [completedOrders, allUnits]);


  const isLoading = userLoading || ordersLoading || unitsLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Please Sign In</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You need to be logged in to see your purchased content.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Unlocked Content</CardTitle>
        <CardDescription>
          Here are all the study materials you have purchased. You can view them at any time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {purchasedItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>You haven't purchased any content yet, or no orders have been completed by an admin.</p>
            <Button asChild variant="link">
                <Link href="/order">Browse materials</Link>
            </Button>
          </div>
        ) : (
            <Accordion type="multiple" defaultValue={purchasedItems.map(c => c.categoryId)} className="w-full">
            {purchasedItems.map(({ categoryId, items }) => (
                <AccordionItem value={categoryId} key={categoryId}>
                    <AccordionTrigger>
                        <h3 className="text-lg font-semibold capitalize">{categoryId.replace('-', ' ')}</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-4">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <FileText className="h-6 w-6 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm md:text-base">{item.title}</p>
                                            <p className="text-muted-foreground text-xs md:text-sm">{item.sinhalaTitle}</p>
                                            <p className="text-xs text-primary mt-1">{item.itemName.split(' - ')[1]}</p>
                                        </div>
                                    </div>
                                    <ViewButton item={item} />
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
