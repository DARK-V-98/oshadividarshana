
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

type PurchasedItem = CartItem & {
    pdfUrl: string | null;
    orderId: string;
};

const DownloadButton = ({ item, userId, idToken, onDownloadSuccess }: { item: PurchasedItem; userId: string; idToken: string | null, onDownloadSuccess: () => void; }) => {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const hasDownloaded = useMemo(() => {
        return item.downloads?.includes(userId);
    }, [item.downloads, userId]);

    const handleDownload = async () => {
        if (!item.pdfUrl) {
            toast({ variant: "destructive", title: "Download Failed", description: "File not available." });
            return;
        }

        if (!idToken) {
            toast({ variant: "destructive", title: "Authentication Error", description: "Could not authenticate your request. Please sign in again." });
            return;
        }

        setIsDownloading(true);
        try {
            const response = await fetch('/api/generate-download-link', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                 },
                body: JSON.stringify({ 
                    orderId: item.orderId,
                    unitId: item.unitId,
                    itemType: item.itemType
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to generate download link.');
            }

            const { downloadUrl } = await response.json();
            window.open(downloadUrl, '_blank');
            toast({ title: "Download started!", description: "Your file is downloading. This is a one-time download." });
            onDownloadSuccess();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Download Failed", description: error.message });
        } finally {
            setIsDownloading(false);
        }
    };

    if (hasDownloaded) {
        return (
            <Button size="sm" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Downloaded
            </Button>
        );
    }

    return (
        <Button onClick={handleDownload} size="sm" disabled={!item.pdfUrl || isDownloading}>
            {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            Download
        </Button>
    );
};

export default function MyContent() {
  const { user, idToken, getIdToken, loading: userLoading } = useUser();
  const [refreshKey, setRefreshKey] = useState(0); // Add this state
  
  const { data: orders, loading: ordersLoading } = useCollection<Order>(
    user ? 'orders' : undefined,
    user ? { where: [['userId', '==', user.uid], ['status', '==', 'completed']] } : undefined,
    [refreshKey] // Add refreshKey to dependencies
  );

  const { data: allUnits, loading: unitsLoading } = useCollection<Unit>('units');
  
  const purchasedItems = useMemo(() => {
    if (!orders?.length || !allUnits?.length) return [];
    
    const itemsWithUrls = new Map<string, PurchasedItem>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const unit = allUnits.find(u => u.id === item.unitId);
        if (!unit) return;

        let pdfUrl: string | null = null;
        switch (item.itemType) {
            case 'sinhalaNote': pdfUrl = unit.pdfUrlSinhalaNote; break;
            case 'sinhalaAssignment': pdfUrl = unit.pdfUrlSinhalaAssignment; break;
            case 'englishNote': pdfUrl = unit.pdfUrlEnglishNote; break;
            case 'englishAssignment': pdfUrl = unit.pdfUrlEnglishAssignment; break;
        }

        const uniqueKey = `${item.unitId}-${item.itemType}`;
        // We only want to show the item if it hasn't been added yet, to avoid duplicates across multiple orders
        if (!itemsWithUrls.has(uniqueKey)) {
             itemsWithUrls.set(uniqueKey, { ...item, pdfUrl, orderId: order.id });
        }
      });
    });

    const itemsByCategory: Record<string, PurchasedItem[]> = {};
    itemsWithUrls.forEach(item => {
        const unit = allUnits.find(u => u.id === item.unitId);
        const category = unit?.category || 'other';
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

  const handleDownloadSuccess = () => {
    // This function will be called after a successful download API call.
    // It refreshes the user's token and forces a re-fetch of the orders data.
    getIdToken();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Content</CardTitle>
        <CardDescription>
          Here are all the study materials you have purchased. Downloads are limited to one time per item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {purchasedItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>You haven't purchased any content yet.</p>
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
