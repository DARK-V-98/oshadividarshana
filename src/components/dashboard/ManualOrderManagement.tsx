
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, writeBatch, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, PackagePlus, Clipboard, ClipboardCheck, History, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Unit, CartItem, ManualOrderKey } from '@/lib/types';
import { moduleCategories } from '@/lib/data';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import ReceiptView from './ReceiptView';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '../ui/table';

const generateKey = (length = 12) => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


const GeneratedKeyHistory = () => {
    const { data: keys, loading } = useCollection<ManualOrderKey>('manualOrderKeys');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Key Copied!", description: "The key has been copied to your clipboard." });
    };

    const { toast } = useToast();

    const sortedKeys = useMemo(() => {
        return (keys || []).sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate());
    }, [keys]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Key Generation History</CardTitle>
                <CardDescription>A log of all previously generated manual order keys.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Loader2 className="animate-spin"/> : (
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Code</TableHead>
                                    <TableHead>Key</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Receipt</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {sortedKeys.map(key => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-semibold">{key.orderCode}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.key)} className="font-mono">
                                                {key.key} <Clipboard className="ml-2 h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                        <TableCell>Rs. {key.total.toLocaleString()}</TableCell>
                                        <TableCell>{format(key.createdAt.toDate(), 'PPp')}</TableCell>
                                        <TableCell>{key.redeemedBy ? `Redeemed on ${format(key.redeemedAt.toDate(), 'PP')}` : 'Not Redeemed'}</TableCell>
                                         <TableCell>
                                             <Dialog>
                                                <DialogTrigger asChild>
                                                        <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Receipt className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-3xl">
                                                    <DialogHeader>
                                                    <DialogTitle>Receipt for Manual Order {key.orderCode}</DialogTitle>
                                                    </DialogHeader>
                                                    <ReceiptView order={{
                                                        ...key, 
                                                        status: 'completed',
                                                        userDisplayName: key.redeemedBy || 'N/A',
                                                        userEmail: 'N/A',
                                                        userId: key.redeemedBy || 'N/A',
                                                    }} />
                                                </DialogContent>
                                            </Dialog>
                                         </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function ManualOrderManagement() {
  const { data: units, loading: unitsLoading, error: unitsError } = useCollection<Unit>('units');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [lastGeneratedKey, setLastGeneratedKey] = useState<string | null>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  const handleCartChange = (checked: boolean | string, unit: Unit, itemType: CartItem['itemType'], price: number, itemName: string) => {
    setCart(prevCart => {
      const cartItem: CartItem = {
        unitId: unit.id, unitCode: unit.code, itemName, price, itemType, title: unit.title, sinhalaTitle: unit.sinhalaTitle,
      };
      if (checked) {
        return [...prevCart, cartItem];
      } else {
        return prevCart.filter(item => !(item.unitId === cartItem.unitId && item.itemType === cartItem.itemType));
      }
    });
  };
  
  const isChecked = (unitId: string, itemType: CartItem['itemType']) => {
    return cart.some(item => item.unitId === unitId && item.itemType === itemType);
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price, 0);
  }, [cart]);

  const handleCreateKey = async () => {
    if (!firestore || cart.length === 0) return;
    setIsCreating(true);

    try {
        const newKey = generateKey();
        
        const keysRef = collection(firestore, "manualOrderKeys");
        const q = query(keysRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        let lastOrderCodeNum = 1000;
        if (!querySnapshot.empty) {
            const lastKey = querySnapshot.docs[0].data();
            if (lastKey.orderCode && lastKey.orderCode.startsWith('MAN-')) {
                lastOrderCodeNum = parseInt(lastKey.orderCode.split('-')[1]) || 1000;
            }
        }
        const newOrderCode = `MAN-${lastOrderCodeNum + 1}`;

        const keyData: Omit<ManualOrderKey, 'id'> = {
            key: newKey,
            orderCode: newOrderCode,
            items: cart,
            total,
            createdAt: serverTimestamp(),
            redeemedBy: null,
            redeemedAt: null
        };
        
        await addDoc(keysRef, keyData);
        
        setLastGeneratedKey(newKey);
        setCart([]);
        toast({ title: "Key Generated Successfully!", description: "The new key has been saved and can be shared." });

    } catch (error: any) {
        console.error("Error creating key:", error);
        toast({ variant: "destructive", title: "Key Generation Failed", description: error.message });
    } finally {
        setIsCreating(false);
    }
  };

  if (unitsLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PackagePlus /> Create Manual Order Key</CardTitle>
                        <CardDescription>Select units to include in a manual order and generate a redeemable key.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Accordion type="multiple" defaultValue={moduleCategories.map(c => c.id)} className="w-full">
                        {moduleCategories.map(category => {
                        const categoryUnits = units.filter(u => u.category === category.id).sort((a,b) => a.code.localeCompare(b.code));
                        if (categoryUnits.length === 0) return null;

                        return (
                            <AccordionItem value={category.id} key={category.id}>
                                <AccordionTrigger><h2 className="text-xl font-semibold">{category.name}</h2></AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 gap-4">
                                    {categoryUnits.map(unit => (
                                        <Card key={unit.id} className="p-4">
                                            <h3 className="font-semibold">{unit.code} - {unit.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-4">{unit.sinhalaTitle}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-center text-sm border-b pb-2">Sinhala Medium</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id={`sn-${unit.id}`} checked={isChecked(unit.id, 'sinhalaNote')} onCheckedChange={(c) => handleCartChange(c, unit, 'sinhalaNote', unit.priceSinhalaNote || 0, `${unit.title} - Sinhala Note`)} />
                                                        <Label htmlFor={`sn-${unit.id}`} className="flex-1 text-sm font-normal">Note</Label>
                                                        <span className="text-sm font-semibold">Rs. {unit.priceSinhalaNote || 0}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id={`sa-${unit.id}`} checked={isChecked(unit.id, 'sinhalaAssignment')} onCheckedChange={(c) => handleCartChange(c, unit, 'sinhalaAssignment', unit.priceSinhalaAssignment || 0, `${unit.title} - Sinhala Assignment`)} />
                                                        <Label htmlFor={`sa-${unit.id}`} className="flex-1 text-sm font-normal">Assignment</Label>
                                                        <span className="text-sm font-semibold">Rs. {unit.priceSinhalaAssignment || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-center text-sm border-b pb-2">English Medium</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id={`en-${unit.id}`} checked={isChecked(unit.id, 'englishNote')} onCheckedChange={(c) => handleCartChange(c, unit, 'englishNote', unit.priceEnglishNote || 0, `${unit.title} - English Note`)} />
                                                        <Label htmlFor={`en-${unit.id}`} className="flex-1 text-sm font-normal">Note</Label>
                                                        <span className="text-sm font-semibold">Rs. {unit.priceEnglishNote || 0}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id={`ea-${unit.id}`} checked={isChecked(unit.id, 'englishAssignment')} onCheckedChange={(c) => handleCartChange(c, unit, 'englishAssignment', unit.priceEnglishAssignment || 0, `${unit.title} - English Assignment`)} />
                                                        <Label htmlFor={`ea-${unit.id}`} className="flex-1 text-sm font-normal">Assignment</Label>
                                                        <span className="text-sm font-semibold">Rs. {unit.priceEnglishAssignment || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )})}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Selected Items</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                        {cart.length === 0 ? (
                            <p className="text-muted-foreground text-center">No items selected.</p>
                        ) : (
                            <ul className="space-y-2">
                                {cart.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center text-sm">
                                        <span className="flex-1 pr-2">{item.itemName}</span>
                                        <span className="font-medium">Rs. {item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col items-stretch space-y-4 pt-6">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Value</span>
                            <span>Rs. {total.toLocaleString()}</span>
                        </div>
                        <Button size="lg" disabled={cart.length === 0 || isCreating} onClick={handleCreateKey}>
                            {isCreating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PackagePlus className="mr-2 h-5 w-5" />}
                            Generate Key
                        </Button>
                        {lastGeneratedKey && (
                             <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
                                <CardHeader className="p-4">
                                <CardTitle className="text-sm flex items-center gap-2">Key Generated!</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="font-mono text-lg break-all">{lastGeneratedKey}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(lastGeneratedKey); toast({title: "Copied to clipboard!"})}}>
                                        <Clipboard className="mr-2 h-4 w-4"/> Copy
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>

        <GeneratedKeyHistory />
    </div>
  );
}
