
"use client";

import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser } from "@/firebase/auth/use-user";
import { useStorage, useFirestore } from "@/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, AlertTriangle, FileText, KeyRound, Unlock } from "lucide-react";
import type { Order, CartItem, Unit, ManualOrderKey } from "@/lib/types";
import { useMemo, useState } from "react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs, writeBatch, serverTimestamp, doc } from "firebase/firestore";
import { Input } from "../ui/input";

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
    const { user } = useUser();

    const handleView = async () => {
        if (!storage || !user) {
            toast({ variant: "destructive", title: "Error", description: "You are not authenticated." });
            return;
        }

        const originalFileName = itemTypeToFileName(item.itemType);
        if (!originalFileName) {
            toast({ variant: "destructive", title: "Invalid Item", description: "The item type is not recognized." });
            return;
        }

        const filePath = `units/${item.unitId}/${originalFileName}`;
        
        setIsGenerating(true);
        try {
            const fileRef = ref(storage, filePath);
            const downloadUrl = await getDownloadURL(fileRef);
            window.open(downloadUrl, '_blank');
            
        } catch (error: any) {
            console.error("Download URL error:", error);
             if (error.code === 'storage/object-not-found') {
                 toast({ variant: "destructive", title: "File Not Found", description: "The file is not available yet. Please contact support if the issue persists." });
            } else if (error.code === 'storage/unauthorized') {
                toast({ variant: "destructive", title: "Permission Denied", description: "You do not have permission to access this file. Please ensure your order has been marked as 'Completed'." });
            } else {
                toast({ variant: "destructive", title: "Failed to Open", description: "An unexpected error occurred while trying to access the file." });
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
  const { user, userProfile, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const { data: completedOrders, loading: ordersLoading, error: ordersError } = useCollection<Order>(
    user ? 'orders' : undefined,
    user ? [
        ['userId', '==', user.uid],
        ['status', '==', 'completed']
    ] : undefined
  );
  const { data: allUnits, loading: unitsLoading } = useCollection<Unit>('units');

  const [searchQuery, setSearchQuery] = useState("");
  const [unlockKey, setUnlockKey] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  
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

    const filteredItems = uniqueItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sinhalaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.unitCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsByCategory: Record<string, (CartItem & { title: string, sinhalaTitle: string })[]> = {};
    filteredItems.forEach(item => {
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

  }, [completedOrders, allUnits, searchQuery]);


  const handleUnlockContent = async () => {
    if (!firestore || !user || !userProfile || !unlockKey) {
      toast({ variant: "destructive", title: "Error", description: "Missing required information." });
      return;
    }
    setIsUnlocking(true);

    try {
        const keysRef = collection(firestore, "manualOrderKeys");
        const q = query(keysRef, where("key", "==", unlockKey));
        const keySnapshot = await getDocs(q);

        if (keySnapshot.empty) {
            toast({ variant: "destructive", title: "Invalid Key", description: "The key you entered does not exist." });
            setIsUnlocking(false);
            return;
        }

        const keyDoc = keySnapshot.docs[0];
        const keyData = keyDoc.data() as ManualOrderKey;

        if (keyData.redeemedBy) {
            toast({ variant: "destructive", title: "Key Already Used", description: "This key has already been redeemed." });
            setIsUnlocking(false);
            return;
        }

        const batch = writeBatch(firestore);

        // 1. Create a new "completed" order for the user
        const newOrderRef = doc(collection(firestore, "orders"));
        const newOrderData: Omit<Order, 'id'> = {
            orderCode: keyData.orderCode,
            userId: user.uid,
            userDisplayName: userProfile.displayName,
            userEmail: userProfile.email,
            items: keyData.items,
            total: keyData.total,
            status: 'completed',
            createdAt: serverTimestamp(),
        };
        batch.set(newOrderRef, newOrderData);

        // 2. Mark the key as redeemed
        batch.update(keyDoc.ref, {
            redeemedBy: user.uid,
            redeemedAt: serverTimestamp()
        });

        await batch.commit();

        toast({ title: "Content Unlocked!", description: "The new content has been added to your account." });
        setUnlockKey("");
    } catch (error: any) {
        console.error("Error unlocking content:", error);
        toast({ variant: "destructive", title: "Unlock Failed", description: error.message || "An unexpected error occurred." });
    } finally {
        setIsUnlocking(false);
    }
  }

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
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary"/> Have an Unlock Key?</h3>
            <p className="text-sm text-muted-foreground mb-3">If you received a key for a manual order, enter it here to unlock your content.</p>
            <div className="flex gap-2">
                <Input 
                    placeholder="Enter your key..."
                    value={unlockKey}
                    onChange={(e) => setUnlockKey(e.target.value)}
                />
                <Button onClick={handleUnlockContent} disabled={isUnlocking || !unlockKey}>
                    {isUnlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
                    Unlock
                </Button>
            </div>
        </div>

        <div className="space-y-4">
            <Input 
                placeholder="Search your unlocked content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />

            <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
                <AlertTitle className="font-semibold !text-yellow-800 dark:!text-yellow-300">A Note on Usage</AlertTitle>
                <AlertDescription>
                  These materials are created with love and care for your personal learning journey. Please do not resell or redistribute them. We take the protection of our intellectual property seriously and will pursue legal action against unauthorized distribution.
                </AlertDescription>
            </Alert>

            {purchasedItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>You haven't purchased any content yet, or no items match your search.</p>
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
        </div>
      </CardContent>
    </Card>
  );
}
