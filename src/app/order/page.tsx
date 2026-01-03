
"use client";

import { useState, useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, ShoppingCart } from 'lucide-react';
import { moduleCategories } from '@/lib/data';
import type { Unit, CartItem } from '@/lib/types';
import { Label } from '@/components/ui/label';

export default function OrderPage() {
  const { data: units, loading: unitsLoading, error } = useCollection<Unit>('units');
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleCartChange = (checked: boolean | string, item: CartItem) => {
    setCart(prevCart => {
      if (checked) {
        return [...prevCart, item];
      } else {
        return prevCart.filter(cartItem => !(cartItem.unitId === item.unitId && cartItem.itemType === item.itemType));
      }
    });
  };
  
  const isChecked = (unitId: string, itemType: CartItem['itemType']) => {
    return cart.some(item => item.unitId === unitId && item.itemType === itemType);
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price, 0);
  }, [cart]);
  
  const generateWhatsAppMessage = () => {
    let message = "Hello! I'd like to place an order for the following items:\n\n";
    
    const itemsByCategory = cart.reduce((acc, item) => {
        const category = units.find(u => u.id === item.unitId)?.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    for (const categoryId in itemsByCategory) {
        const category = moduleCategories.find(c => c.id === categoryId);
        message += `*${category ? category.name : categoryId}*\n`;
        itemsByCategory[categoryId].forEach(item => {
            message += `- ${item.itemName} (${item.unitCode}) - Rs. ${item.price}\n`;
        });
        message += '\n';
    }

    message += `*Total: Rs. ${total.toLocaleString()}*\n\n`;
    message += "Please let me know the next steps. Thank you!";

    return encodeURIComponent(message);
};


  if (unitsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-12 md:my-24 text-center text-destructive">
        <h1 className="text-2xl font-bold">Error loading units</h1>
        <p>{error.message}</p>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-center text-sm border-b pb-1">Sinhala Medium</h4>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id={`sn-${unit.id}`} checked={isChecked(unit.id, 'sinhalaNote')} onCheckedChange={(c) => handleCartChange(c, {unitId: unit.id, unitCode: unit.code, itemName: `${unit.title} - Sinhala Note`, price: unit.priceSinhalaNote || 0, itemType: 'sinhalaNote' })} />
                                            <Label htmlFor={`sn-${unit.id}`} className="flex-1 text-sm font-normal">Note</Label>
                                            <span className="text-sm font-semibold">Rs. {unit.priceSinhalaNote || 0}</span>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <Checkbox id={`sa-${unit.id}`} checked={isChecked(unit.id, 'sinhalaAssignment')} onCheckedChange={(c) => handleCartChange(c, {unitId: unit.id, unitCode: unit.code, itemName: `${unit.title} - Sinhala Assignment`, price: unit.priceSinhalaAssignment || 0, itemType: 'sinhalaAssignment' })}/>
                                            <Label htmlFor={`sa-${unit.id}`} className="flex-1 text-sm font-normal">Assignment</Label>
                                            <span className="text-sm font-semibold">Rs. {unit.priceSinhalaAssignment || 0}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-center text-sm border-b pb-1">English Medium</h4>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id={`en-${unit.id}`} checked={isChecked(unit.id, 'englishNote')} onCheckedChange={(c) => handleCartChange(c, {unitId: unit.id, unitCode: unit.code, itemName: `${unit.title} - English Note`, price: unit.priceEnglishNote || 0, itemType: 'englishNote' })}/>
                                            <Label htmlFor={`en-${unit.id}`} className="flex-1 text-sm font-normal">Note</Label>
                                            <span className="text-sm font-semibold">Rs. {unit.priceEnglishNote || 0}</span>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <Checkbox id={`ea-${unit.id}`} checked={isChecked(unit.id, 'englishAssignment')} onCheckedChange={(c) => handleCartChange(c, {unitId: unit.id, unitCode: unit.code, itemName: `${unit.title} - English Assignment`, price: unit.priceEnglishAssignment || 0, itemType: 'englishAssignment' })}/>
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
                                    <span className="flex-1 pr-2">{item.itemName} ({item.unitCode})</span>
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
                    <Button size="lg" disabled={cart.length === 0} asChild>
                         <a href={`https://wa.me/94754420805?text=${generateWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Place Order via WhatsApp
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </main>
  );
}
