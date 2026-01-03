import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FirebaseProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Oshadi Vidarshana | NVQ Level 4 Study Materials & Bridal Services',
  description: 'Your expert resource for NVQ Level 4 study materials and professional bridal services in Sri Lanka. Complete notes, assignments, and bridal makeup services by M.K.D Oshadi Vidarshana Perera.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-poppins antialiased")}>
        <FirebaseProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
