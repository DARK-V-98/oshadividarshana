
"use client";

import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser } from "@/firebase/auth/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Download, AlertTriangle, FileText, Lock } from "lucide-react";
import type { Order, CartItem, Unit } from "@/lib/types";
import { useMemo, useState } from "react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const DownloadButton = ({ item, userId, idToken, onDownloadSuccess }: { item: CartItem; userId: string; idToken: string | null, onDownloadSuccess: (item: CartItem) => void; }) => {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);
    const storage = getStorage();

    const handleDownload = async () => {
        if (!item.userFileUrl) {
            toast({ variant: "destructive", title: "Download Failed", description: "File not available." });
            return;
        }

        if (!idToken) {
            toast({ variant: "destructive", title: "Authentication Error", description: "Please sign in again." });
            return;
        }

        setIsDownloading(true);
        try {
            // Get the download URL for the user-specific file
            const fileRef = ref(storage, item.userFileUrl);
            const downloadUrl = await getDownloadURL(fileRef);

            // Trigger the download
            window.open(downloadUrl, '_blank');
            toast({ title: "Download started!", description: "Your file is downloading." });

            // Call the delete API
            await fetch('/api/delete-user-file', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                 },
                body: JSON.stringify({
                    orderId: (item as any).orderId, // We'll need to pass orderId to the item
                    unitId: item.unitId,
                    itemType: item.itemType
                }),
            });

            onDownloadSuccess(item);

        } catch (error: any) {
            console.error("Download error:", error);
            toast({ variant: "destructive", title: "Download Failed", description: error.message });
        } finally {
            setIsDownloading(false);
        }
    };

    if (item.downloaded) {
        return (
            <Button size="sm" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Downloaded
            </Button>
        );
    }

    return (
        <Button onClick={handleDownload} size="sm" disabled={!item.userFileUrl || isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download
        </Button>
    );
};

export default function MyContent() {
  const { user, idToken, loading: userLoading } = useUser();
  
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  const { data: fetchedOrders, loading: ordersLoading } = useCollection<Order>(
    user ? 'orders' : undefined,
    user ? { where: [['userId', '==', user.uid], ['status', '==', 'completed']] } : undefined
  );

  useEffect(() => {
    if (fetchedOrders) {
      setLocalOrders(fetchedOrders);
    }
  }, [fetchedOrders]);


  const purchasedItems = useMemo(() => {
    if (!localOrders?.length) return [];
    
    const itemsWithUrls: (CartItem & { orderId: string, category: string })[] = [];

    localOrders.forEach(order => {
      order.items.forEach(item => {
        if(item.userFileUrl) { // Only show items that have a user file created
            itemsWithUrls.push({ 
                ...item, 
                orderId: order.id,
                category: allUnits.find(u => u.id === item.unitId)?.category || 'other'
            });
        }
      });
    });

    const itemsByCategory: Record<string, (CartItem & { orderId: string })[]> = {};
    itemsWithUrls.forEach(item => {
        const category = item.category || 'other';
        if (!itemsByCategory[category]) {
            itemsByCategory[category] = [];
        }
        itemsByCategory[category].push(item);
    });

    return Object.entries(itemsByCategory).map(([categoryId, items]) => ({
        categoryId,
        items: items.sort((a,b) => a.unitCode.localeCompare(b.unitCode)),
    }));

  }, [localOrders]);

  const { data: allUnits, loading: unitsLoading } = useCollection<Unit>('units');

  const handleDownloadSuccess = (downloadedItem: CartItem) => {
    // Update the local state to reflect that the item has been downloaded
    setLocalOrders(prevOrders => prevOrders.map(order => ({
        ...order,
        items: order.items.map(item => 
            item.unitId === downloadedItem.unitId && item.itemType === downloadedItem.itemType
            ? { ...item, downloaded: true }
            : item
        )
    })));
  };

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
          Here are all the study materials you have purchased. Downloads are limited to one time per item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {purchasedItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>You haven't purchased any content yet, or no orders are marked as 'completed'.</p>
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
                                            <p className="font-medium">{item.itemName}</p>
                                            <p className="text-sm text-muted-foreground">{item.unitCode}</p>
                                        </div>
                                    </div>
                                    <DownloadButton item={item} userId={user.uid} idToken={idToken} onDownloadSuccess={handleDownloadSuccess} />
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
