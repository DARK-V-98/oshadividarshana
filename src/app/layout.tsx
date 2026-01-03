
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FirebaseProvider } from '@/firebase';
import { CartProvider } from '@/context/CartContext';

const siteUrl = 'https://www.oshadividarshana.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Oshadi Vidarshana | NVQ Level 4 Courses & Bridal Services in Sri Lanka',
    template: '%s | Oshadi Vidarshana',
  },
  description: 'Your expert resource for NVQ Level 4 study materials (Bridal, Beauty, Hair) and professional bridal makeup services in Sri Lanka. Specializing in Kandyan bridal dressing.',
  keywords: [
    'NVQ Level 4 Sri Lanka',
    'Bridal Makeup Artist Sri Lanka',
    'Beautician Courses Sri Lanka',
    'Hair Dressing Course Sri Lanka',
    'Kandyan Bridal',
    'Oshadi Vidarshana',
    'Bridal Notes',
    'Beauty Culture Notes',
    'NVQ Assignments',
    'Professional Makeup Artist',
  ],
  authors: [{ name: 'M.K.D Oshadi Vidarshana Perera' }],
  creator: 'M.K.D Oshadi Vidarshana Perera',
  publisher: 'Oshadi Vidarshana',
  openGraph: {
    title: 'Oshadi Vidarshana | NVQ Level 4 & Bridal Services',
    description: 'The #1 resource for NVQ Level 4 beautician courses and professional bridal services in Sri Lanka.',
    url: siteUrl,
    siteName: 'Oshadi Vidarshana',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Oshadi Vidarshana - NVQ Courses and Bridal Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oshadi Vidarshana | NVQ Level 4 & Bridal Services',
    description: 'The leading platform for NVQ Level 4 beauty qualifications and bridal makeup in Sri Lanka.',
    creator: '@oshadi_vidarshana', // Replace with actual Twitter handle if available
    images: [`${siteUrl}/twitter-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#E11D48',
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-poppins antialiased")}>
        <div className="relative overflow-x-hidden">
          <FirebaseProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingWhatsApp />
              <Toaster />
            </CartProvider>
          </FirebaseProvider>
        </div>
      </body>
    </html>
  );
}
