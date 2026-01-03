
"use client";

import { useCollection } from "@/firebase/firestore/use-collection";
import { useUser } from "@/firebase/auth/use-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Download, AlertTriangle, FileText } from "lucide-react";
import type { Order, CartItem, Unit } from "@/lib/types";
import { useMemo } from "react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

type PurchasedItem = CartItem & {
    pdfUrl: string | null;
};

const DownloadButton = ({ item }: { item: PurchasedItem }) => {
    const { toast } = useToast();

    const handleDownload = () => {
        if (!item.pdfUrl) {
            toast({ variant: "destructive", title: "Download Failed", description: "File not available." });
            return;
        }
        window.open(item.pdfUrl, '_blank');
    };

    return (
        <Button onClick={handleDownload} size="sm" disabled={!item.pdfUrl}>
            <Download className="mr-2 h-4 w-4" />
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
        if (!itemsWithUrls.has(uniqueKey)) {
            itemsWithUrls.set(uniqueKey, { ...item, pdfUrl });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Content</CardTitle>
        <CardDescription>
          Here are all the study materials you have purchased.
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
