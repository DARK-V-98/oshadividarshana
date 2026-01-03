
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useCart } from '@/context/CartContext';
import { moduleCategories } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Unit } from '@/lib/types';

export default function PackSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const { setCart } = useCart();
  const { toast } = useToast();
  
  const [packDetails, setPackDetails] = useState<{
    category: string;
    medium: 'sinhala' | 'english';
    itemType: 'note' | 'assignment';
    count: number;
    categoryName: string;
  } | null>(null);

  const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
  
  const { data: allUnits, loading: unitsLoading } = useCollection<Unit>('units');
  
  useEffect(() => {
    if (typeof params.pack === 'string') {
      const parts = params.pack.split('-');
      if (parts.length >= 4) {
        const [category, medium, itemType, count] = parts;
        const categoryDetails = moduleCategories.find(c => c.id === category);
        setPackDetails({
          category: category,
          medium: medium as 'sinhala' | 'english',
          itemType: itemType as 'note' | 'assignment',
          count: parseInt(count, 10),
          categoryName: categoryDetails?.name || 'Unknown Category',
        });
      }
    }
  }, [params.pack]);

  const handleCheckboxChange = (checked: boolean | string, unit: Unit) => {
    setSelectedUnits(prev => {
      if (checked) {
        if (prev.length >= (packDetails?.count || 0)) {
          toast({
            variant: 'destructive',
            title: `You can only select ${packDetails?.count} items.`,
          });
          return prev;
        }
        return [...prev, unit];
      } else {
        return prev.filter(u => u.id !== unit.id);
      }
    });
  };

  const handleAddToCart = () => {
    if (!packDetails) return;

    const itemsToAdd = selectedUnits.map(unit => {
        const isNote = packDetails.itemType === 'note';
        const price = packDetails.medium === 'sinhala' 
            ? (isNote ? unit.priceSinhalaNote : unit.priceSinhalaAssignment)
            : (isNote ? unit.priceEnglishNote : unit.priceEnglishAssignment);
        
        const itemName = `${unit.title} - ${packDetails.medium === 'sinhala' ? 'Sinhala' : 'English'} ${isNote ? 'Note' : 'Assignment'}`;
        const itemType = `${packDetails.medium}${isNote ? 'Note' : 'Assignment'}` as any;

        return {
            unitId: unit.id,
            unitCode: unit.code,
            itemName: itemName,
            price: price || 0,
            itemType: itemType,
            title: unit.title,
            sinhalaTitle: unit.sinhalaTitle
        };
    });

    setCart(prevCart => {
        // Simple add, assuming no duplicates from previous selections
        return [...prevCart, ...itemsToAdd];
    });

    toast({
        title: `${itemsToAdd.length} items added to your cart.`
    });
    
    router.push('/order');
  };

  const availableUnits = allUnits.filter(u => u.category === packDetails?.category);
  const remainingSelections = packDetails ? packDetails.count - selectedUnits.length : 0;

  if (unitsLoading || !packDetails) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <main className="container my-12 md:my-24">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your {packDetails.count}-Pack</CardTitle>
          <CardDescription>
            Choose {packDetails.count} {packDetails.itemType}s from the {packDetails.categoryName} ({packDetails.medium}) category.
            You have {remainingSelections} selection{remainingSelections !== 1 ? 's' : ''} remaining.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          {availableUnits.map(unit => (
            <div key={unit.id} className="flex items-center space-x-3 rounded-md border p-4">
              <Checkbox
                id={unit.id}
                onCheckedChange={(c) => handleCheckboxChange(c, unit)}
                checked={selectedUnits.some(u => u.id === unit.id)}
                disabled={selectedUnits.length >= packDetails.count && !selectedUnits.some(u => u.id === unit.id)}
              />
              <label htmlFor={unit.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <span className="font-semibold">{unit.code}</span>: {unit.title}
                <p className="text-xs text-muted-foreground">{unit.sinhalaTitle}</p>
              </label>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddToCart} disabled={remainingSelections !== 0} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add {packDetails.count} Items to Cart
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
