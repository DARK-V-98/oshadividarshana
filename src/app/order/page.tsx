
"use client";

import { useMemo, useState } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, ShoppingCart, AlertTriangle, CheckCircle } from 'lucide-react';
import { moduleCategories } from '@/lib/data';
import type { Unit, CartItem } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Order Course Materials',
  description: 'Select and order NVQ Level 4 notes and assignments for Bridal, Beauty, and Hair Dressing courses. Secure your study materials today.',
};

export default function OrderPage() {
  const { data: units, loading: unitsLoading, error: unitsError } = useCollection<Unit>('units');
  const { cart, setCart } = useCart();
  const { user, userProfile, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [orderCode, setOrderCode] = useState('');

  const handleCartChange = (checked: boolean | string, unit: Unit, itemType: CartItem['itemType'], price: number, itemName: string) => {
    setCart(prevCart => {
      const cartItem: CartItem = {
        unitId: unit.id,
        unitCode: unit.code,
        itemName,
        price,
        itemType,
        title: unit.title,
        sinhalaTitle: unit.sinhalaTitle,
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

  const handlePlaceOrder = async () => {
    if (!firestore || !user || !userProfile || cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      // Get the last order to generate a new order code
      const ordersRef = collection(firestore, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      let lastOrderCode = 1000;
      if (!querySnapshot.empty) {
          const lastOrder = querySnapshot.docs[0].data();
          if (lastOrder.orderCode && lastOrder.orderCode.includes('-')) {
            const codeNumber = parseInt(lastOrder.orderCode.split('-')[1]);
            if (!isNaN(codeNumber)) {
                lastOrderCode = codeNumber;
            }
          }
      }
      const newOrderCode = `ORD-${lastOrderCode + 1}`;
      setOrderCode(newOrderCode);

      // Create order document
      const orderData = {
        orderCode: newOrderCode,
        userId: user.uid,
        userDisplayName: userProfile.displayName,
        userEmail: userProfile.email,
        items: cart,
        total: total,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      
      await addDoc(ordersRef, orderData);

      // Generate WhatsApp message
      let message = `Hello! I'd like to place an order.\n\n*Order Code: ${newOrderCode}*\n\n`;
      cart.forEach(item => {
        message += `- ${item.itemName} (${item.unitCode}) - Rs. ${item.price}\n`;
      });
      message += `\n*Total: Rs. ${total.toLocaleString()}*\n\n`;
      message += "Please provide the bank details for payment. Thank you!";
      
      setWhatsappUrl(`https://wa.me/94754420805?text=${encodeURIComponent(message)}`);

      toast({
        title: 'Order Submitted!',
        description: 'Your order has been created. Please complete the process on WhatsApp.',
      });
      
      setShowConfirmation(true);

    } catch (error) {
        console.error("Error placing order:", error);
        toast({
            variant: "destructive",
            title: 'Order Failed',
            description: 'There was a problem creating your order. Please try again.',
        });
    } finally {
        setIsPlacingOrder(false);
    }
  };

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setCart([]); // Clear cart
    router.push('/dashboard');
  }

  const isLoading = unitsLoading || userLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (unitsError) {
    return (
      <div className="container my-12 md:my-24 text-center text-destructive">
        <h1 className="text-2xl font-bold">Error loading units</h1>
        <p>{unitsError.message}</p>
      </div>
    )
  }

  if (!user) {
    return (
        <div className="container my-12 md:my-24 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2"><AlertTriangle className="text-destructive"/> Please Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You need to be logged in to place an order.</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/auth">Sign In or Create Account</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <main className="container my-12 md:my-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          Place Your Order
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Select the study materials you need.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Accordion type="multiple" defaultValue={moduleCategories.map(c => c.id)} className="w-full">
            {moduleCategories.map(category => {
              const categoryUnits = units.filter(u => u.category === category.id).sort((a,b) => a.code.localeCompare(b.code));
              if (categoryUnits.length === 0) return null;

              return (
                <AccordionItem value={category.id} key={category.id}>
                    <AccordionTrigger>
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                    </AccordionTrigger>
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
                                            <Checkbox id={`sa-${unit.id}`} checked={isChecked(unit.id, 'sinhalaAssignment')} onCheckedChange={(c) => handleCartChange(c, unit, 'sinhalaAssignment', unit.priceSinhalaAssignment || 0, `${unit.title} - Sinhala Assignment`)}/>
                                            <Label htmlFor={`sa-${unit.id}`} className="flex-1 text-sm font-normal">Assignment</Label>
                                            <span className="text-sm font-semibold">Rs. {unit.priceSinhalaAssignment || 0}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-center text-sm border-b pb-2">English Medium</h4>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id={`en-${unit.id}`} checked={isChecked(unit.id, 'englishNote')} onCheckedChange={(c) => handleCartChange(c, unit, 'englishNote', unit.priceEnglishNote || 0, `${unit.title} - English Note`)}/>
                                            <Label htmlFor={`en-${unit.id}`} className="flex-1 text-sm font-normal">Note</Label>
                                            <span className="text-sm font-semibold">Rs. {unit.priceEnglishNote || 0}</span>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <Checkbox id={`ea-${unit.id}`} checked={isChecked(unit.id, 'englishAssignment')} onCheckedChange={(c) => handleCartChange(c, unit, 'englishAssignment', unit.priceEnglishAssignment || 0, `${unit.title} - English Assignment`)}/>
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
              )
            })}
            </Accordion>
        </div>
        <div className="md:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Your Order</CardTitle>
                    <CardDescription>Review your items before placing the order.</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-muted-foreground text-center">Your cart is empty.</p>
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
                        <span>Total</span>
                        <span>Rs. {total.toLocaleString()}</span>
                    </div>
                    <Button size="lg" disabled={cart.length === 0 || !user || isPlacingOrder} onClick={handlePlaceOrder}>
                        {isPlacingOrder ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                        Place Order
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" />
                    Order Placed Successfully!
                </DialogTitle>
                <DialogDescription className="pt-2">
                    Your order with code <strong>{orderCode}</strong> has been submitted. To complete your purchase, please send the order details to us on WhatsApp to receive payment information.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start gap-2">
                <Button asChild className="w-full sm:w-auto" size="lg">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <ShoppingCart className="mr-2 h-5 w-5" /> Send via WhatsApp
                    </a>
                </Button>
                <Button onClick={closeConfirmationDialog} variant="outline" className="w-full sm:w-auto">
                    Go to Dashboard
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

    