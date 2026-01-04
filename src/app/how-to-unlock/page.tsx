
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, KeyRound, ShoppingCart, CheckCircle, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HowToUnlockPage() {
  const { toast } = useToast();

  const orderInstructionsTextEnglish = `How to Get Your Content (Standard Order):

1. Sign In: Create an account or sign in at https://www.oshadividarshana.online/auth
2. Place Order: Go to the order page and select the notes/assignments you need.
3. WhatsApp Confirmation: After placing the order, you will be prompted to send the order details via WhatsApp.
4. Make Payment: You will receive bank details for payment on WhatsApp. Complete the payment.
5. Order Completion: Once your payment is confirmed, your order status will be set to "Completed" by the admin.
6. Access Content: Go to your Dashboard -> My Unlocked Content. You will have 6 hours to view and download your files. After this period, access will expire.`;

  const orderInstructionsTextSinhala = `Standard Order සඳහා උපදෙස්:

Standard Order එකක් භාවිතා කර Content ලබාගන්නේ මෙසේයි:

Sign In වන්න:
https://www.oshadividarshana.online/auth වෙබ් අඩවියට පිවිස ගිණුමක් සාදන්න හෝ දැනටමත් තිබේ නම් Sign In වන්න.

Order එක Place කරන්න:
Order page එකට ගොස් ඔබට අවශ්‍ය Notes / Assignments තෝරන්න.

WhatsApp Confirmation:
Order එක Place කිරීමෙන් පසු, Order විස්තර WhatsApp හරහා යැවීමට ඔබට දැනුම්දීමක් ලැබේ.

Payment සිදු කරන්න:
Payment සඳහා අවශ්‍ය Bank විස්තර WhatsApp හරහා ඔබට ලැබේ. එම විස්තර අනුව Payment එක සම්පූර්ණ කරන්න.

Order සම්පූර්ණ කිරීම:
ඔබගේ Payment එක Confirm වූ පසු, Admin විසින් Order Status එක “Completed” ලෙස වෙනස් කරනු ඇත.

Content ලබාගන්න:
Dashboard → My Unlocked Content වෙත පිවිසෙන්න.
ඔබට ඔබගේ Files පැය 6ක් (6 hours) තුළ බැලීමට හා Download කිරීමට හැකියාව ඇත. මෙම කාලය අවසන් වූ පසු, ප්‍රවේශය කල් ඉකුත් වේ.`;


  const keyInstructionsTextEnglish = `How to Get Your Content (Using an Unlock Key):

1. Sign In: Create an account or sign in at https://www.oshadividarshana.online/auth
2. Receive Key: You will receive a special Unlock Key from the admin after manual payment.
3. Go to Dashboard: Navigate to your Dashboard -> My Unlocked Content.
4. Unlock Content: Enter the key in the "Have an Unlock Key?" section and click "Unlock".
5. Access Content: Your content will appear immediately. Your 6-hour access timer starts now. After 6 hours, access will expire.`;
  
  const keyInstructionsTextSinhala = `Unlock Key සඳහා උපදෙස්:

Unlock Key භාවිතා කර Content ලබාගන්නේ මෙසේයි:

Sign In වන්න:
https://www.oshadividarshana.online/auth වෙබ් අඩවියට පිවිස ගිණුමක් සාදන්න හෝ Sign In වන්න.

Unlock Key ලබාගන්න:
Manual payment එක සිදු කිරීමෙන් පසු Admin විසින් ඔබට විශේෂ Unlock Key එකක් ලබාදෙනු ඇත.

Dashboard වෙත යන්න:
Dashboard → My Unlocked Content වෙත පිවිසෙන්න.

Content Unlock කරන්න:
“Have an Unlock Key?” කියන කොටසට ඔබට ලැබුණු Unlock Key එක ඇතුළත් කර “Unlock” බොත්තම ක්ලික් කරන්න.

Content භාවිතා කරන්න:
Unlock කළ Content එක ඔබට වහාම පෙන්වයි.
මෙහිදී ඔබගේ පැය 6ක (6 hours) ප්‍රවේශ කාලය එම මොහොතේ සිට ආරම්භ වේ. පැය 6කට පසු, ප්‍රවේශය කල් ඉකුත් වේ.`;


  const copyToClipboard = async (text: string, lang: 'English' | 'Sinhala') => {
    try {
        await navigator.clipboard.writeText(text);
        toast({ title: `${lang} instructions copied to clipboard!` });
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
            <CardContent>
                <Tabs defaultValue="english">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="english">English</TabsTrigger>
                        <TabsTrigger value="sinhala">සිංහල</TabsTrigger>
                    </TabsList>
                    <TabsContent value="english" className="space-y-6">
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
                            icon={Unlock}
                            title="Step 3: Access Your Content"
                            description="Go to your Dashboard and find your files under 'My Unlocked Content'. A 6-hour countdown will begin once the order is marked as completed. Access expires after 6 hours."
                        />
                        <Button onClick={() => copyToClipboard(orderInstructionsTextEnglish, 'English')} variant="secondary" className="w-full">
                            Copy English Instructions
                        </Button>
                    </TabsContent>
                    <TabsContent value="sinhala" className="space-y-6">
                        <Step 
                            icon={FileText}
                            title="පියවර 1: Order එක Place කරන්න"
                            description="Sign in වී, Order පිටුවට ගොස්, ඔබට අවශ්‍ය අයිතම තෝරා 'Place Order' ක්ලික් කරන්න. Order එකේ විස්තර WhatsApp හරහා යැවීමට ඔබට දැනුම් දෙනු ඇත."
                        />
                        <Step 
                            icon={CheckCircle}
                            title="පියවර 2: Payment එක සම්පූර්ණ කරන්න"
                            description="WhatsApp හරහා ඔබට බැංකු විස්තර ලැබෙනු ඇත. ඔබ ගෙවීම සිදු කර එය තහවුරු වූ පසු, admin විසින් ඔබගේ order එක 'Completed' ලෙස සලකුණු කරනු ඇත."
                        />
                        <Step 
                            icon={Unlock}
                            title="පියවර 3: Content වෙත පිවිසෙන්න"
                            description="Dashboard වෙත ගොස් 'My Unlocked Content' යටතේ ඇති ඔබගේ files බලන්න. Order එක completed වූ මොහොතේ සිට පැය 6ක countdown එකක් ආරම්භ වේ. පැය 6කට පසු ප්‍රවේශය අවලංගු වේ."
                        />
                        <Button onClick={() => copyToClipboard(orderInstructionsTextSinhala, 'Sinhala')} variant="secondary" className="w-full">
                            උපදෙස් කොපි කරගන්න
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><KeyRound /> Method 2: Using an Unlock Key</CardTitle>
                <CardDescription>For manual orders where you receive a key from the admin.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="english">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="english">English</TabsTrigger>
                        <TabsTrigger value="sinhala">සිංහල</TabsTrigger>
                    </TabsList>
                    <TabsContent value="english" className="space-y-6">
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
                            description="Enter the key into the 'Have an Unlock Key?' box and click 'Unlock'. Your 6-hour access timer will start immediately and expire after 6 hours."
                        />
                        <Button onClick={() => copyToClipboard(keyInstructionsTextEnglish, 'English')} variant="secondary" className="w-full">
                            Copy English Instructions
                        </Button>
                    </TabsContent>
                    <TabsContent value="sinhala" className="space-y-6">
                        <Step 
                            icon={FileText}
                            title="පියවර 1: Unlock Key එක ලබාගන්න"
                            description="Admin සමග manual payment එකක් සිදුකළ පසු, ඔබට WhatsApp හෝ වෙනත් ක්‍රමයකින් විශේෂ Unlock Key එකක් ලැබෙනු ඇත."
                        />
                        <Step 
                            icon={CheckCircle}
                            title="පියවර 2: Dashboard වෙත යන්න"
                            description="ඔබගේ ගිණුමට Sign in වී, Dashboard එකේ 'My Unlocked Content' කොටසට යන්න."
                        />
                        <Step 
                            icon={Unlock}
                            title="පියවර 3: Key එක Redeem කරන්න"
                            description="'Have an Unlock Key?' කොටුවේ Key එක ඇතුළත් කර 'Unlock' ක්ලික් කරන්න. ඔබගේ පැය 6ක ප්‍රවේශ කාලය වහාම ආරම්භ වන අතර, පැය 6කට පසු එය අවලංගු වේ."
                        />
                        <Button onClick={() => copyToClipboard(keyInstructionsTextSinhala, 'Sinhala')} variant="secondary" className="w-full">
                           උපදෙස් කොපි කරගන්න
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}

    