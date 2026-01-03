
"use client";

import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser } from "@/firebase/auth/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Download, AlertTriangle, FileText } from "lucide-react";
import type { Order, CartItem, Unit } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const DownloadButton = ({ item }: { item: CartItem }) => {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);
    const storage = getStorage();

    const handleDownload = async () => {
        if (!item.userFileUrl) {
            toast({ variant: "destructive", title: "Download Failed", description: "File not available for download." });
            return;
        }

        setIsDownloading(true);
        try {
            const fileRef = ref(storage, item.userFileUrl);
            const downloadUrl = await getDownloadURL(fileRef);
            
            window.open(downloadUrl, '_blank');
            toast({ title: "Download started!", description: "Your file should begin downloading shortly." });

        } catch (error: any) {
            console.error("Download error:", error);
            toast({ variant: "destructive", title: "Download Failed", description: "Could not generate download link. Please try again." });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button onClick={handleDownload} size="sm" disabled={!item.userFileUrl || isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download
        </Button>
    );
};


export default function MyContent() {
  const { user, loading: userLoading } = useUser();
  const { data: orders, loading: ordersLoading } = useCollection<Order>(
    user ? 'orders' : undefined,
    user ? { where: [['userId', '==', user.uid], ['status', '==', 'completed']] } : undefined
  );
  const { data: allUnits, loading: unitsLoading } = useCollection<Unit>('units');

  const purchasedItems = useMemo(() => {
    if (!orders?.length || !allUnits?.length) return [];
    
    const itemsWithUrls: (CartItem & { orderId: string, category: string })[] = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if(item.userFileUrl) { 
            const unit = allUnits.find(u => u.id === item.unitId);
            itemsWithUrls.push({ 
                ...item, 
                orderId: order.id,
                category: unit?.category || 'other'
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

  }, [orders, allUnits]);


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
          Here are all the study materials you have purchased. You can download them at any time.
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
                                            <p className="font-medium">{item.itemName}</p>
                                            <p className="text-sm text-muted-foreground">{item.unitCode}</p>
                                        </div>
                                    </div>
                                    <DownloadButton item={item} />
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
