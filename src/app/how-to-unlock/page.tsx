
'use client';

import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, KeyRound, ShoppingCart, CheckCircle, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function HowToUnlockPage() {
  const { toast } = useToast();

  const orderInstructionsText = `How to Get Your Content (Standard Order):

1. Sign In: Create an account or sign in at https://www.oshadividarshana.online/auth
2. Place Order: Go to the order page and select the notes/assignments you need.
3. WhatsApp Confirmation: After placing the order, you will be prompted to send the order details via WhatsApp.
4. Make Payment: You will receive bank details for payment on WhatsApp. Complete the payment.
5. Order Completion: Once your payment is confirmed, your order status will be set to "Completed" by the admin.
6. Access Content: Go to your Dashboard -> My Unlocked Content. You will have 6 hours to view and download your files.`;

  const keyInstructionsText = `How to Get Your Content (Using an Unlock Key):

1. Sign In: Create an account or sign in at https://www.oshadividarshana.online/auth
2. Receive Key: You will receive a special Unlock Key from the admin after manual payment.
3. Go to Dashboard: Navigate to your Dashboard -> My Unlocked Content.
4. Unlock Content: Enter the key in the "Have an Unlock Key?" section and click "Unlock".
5. Access Content: Your content will appear immediately. Your 6-hour access timer starts now.`;


  const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast({ title: "Instructions copied to clipboard!" });
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  };
  
const Step = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
    const Icon = icon;
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

  return (
    <main className="container my-12 md:my-24">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-playfair">
          How to Access Your Content
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Follow these simple steps to unlock your study materials.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><ShoppingCart /> Method 1: Standard Order</CardTitle>
                <CardDescription>For placing orders directly through the website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Step 
                    icon={FileText}
                    title="Step 1: Place Your Order"
                    description="Sign in, go to the Order page, select your items, and click 'Place Order'. You will be prompted to send the order details via WhatsApp."
                />
                <Step 
                    icon={CheckCircle}
                    title="Step 2: Complete Payment"
                    description="You will receive bank details via WhatsApp. After you make the payment and it's confirmed, the admin will mark your order as 'Completed'."
                />
                <Step 
                    icon={KeyRound}
                    title="Step 3: Access Your Content"
                    description="Go to your Dashboard and find your files under 'My Unlocked Content'. A 6-hour countdown will begin once the order is marked as completed."
                />
                <Button onClick={() => copyToClipboard(orderInstructionsText)} variant="secondary" className="w-full">
                    Copy Instructions for Clients
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><KeyRound /> Method 2: Using an Unlock Key</CardTitle>
                <CardDescription>For manual orders where you receive a key from the admin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <Step 
                    icon={FileText}
                    title="Step 1: Receive Your Key"
                    description="After making a manual payment directly with the admin, you will be given a unique Unlock Key via WhatsApp or another method."
                />
                 <Step 
                    icon={CheckCircle}
                    title="Step 2: Go to Your Dashboard"
                    description="Sign in to your account and navigate to the 'My Unlocked Content' section in your Dashboard."
                />
                 <Step 
                    icon={Unlock}
                    title="Step 3: Redeem the Key"
                    description="Enter the key into the 'Have an Unlock Key?' box and click 'Unlock'. Your 6-hour access timer will start immediately."
                />
                 <Button onClick={() => copyToClipboard(keyInstructionsText)} variant="secondary" className="w-full">
                    Copy Instructions for Clients
                </Button>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
