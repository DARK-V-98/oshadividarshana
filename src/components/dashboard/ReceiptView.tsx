
'use client';

import { useRef, useState } from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function ReceiptView({ order }: { order: Order }) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    const element = receiptRef.current;
    if (!element) return;
    
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Receipt-${order.orderCode}.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Ensure createdAt is a Date object before formatting
  const createdAtDate = typeof order.createdAt === 'string' ? new Date(order.createdAt) : (order.createdAt as any).toDate();

  return (
    <div>
        <div ref={receiptRef} className="p-4 md:p-8 bg-card text-card-foreground shadow-lg rounded-lg">
            <header className="flex justify-between items-start pb-4 border-b">
            <div>
                <h1 className="text-3xl font-bold font-playfair text-primary">Receipt / Invoice</h1>
                <p className="text-muted-foreground">Order: {order.orderCode}</p>
            </div>
            <div className="text-right">
                <h2 className="text-xl font-semibold font-playfair">Oshadi Vidarshana</h2>
                <p className="text-sm text-muted-foreground">NVQ Level 4 Certified</p>
            </div>
            </header>

            <section className="grid md:grid-cols-2 gap-8 my-6">
            <div>
                <h3 className="font-semibold mb-2 text-muted-foreground">BILL TO</h3>
                <p className="font-medium">{order.userDisplayName}</p>
                <p>{order.userEmail}</p>
            </div>
            <div className="text-left md:text-right">
                <h3 className="font-semibold mb-2 text-muted-foreground">RECEIPT DETAILS</h3>
                <p><span className="font-medium">Receipt #:</span> {order.orderCode}</p>
                <p><span className="font-medium">Date Issued:</span> {format(createdAtDate, 'PPP')}</p>
            </div>
            </section>

            <section>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-muted">
                    <tr>
                    <th className="p-3 font-semibold">Item Description</th>
                    <th className="p-3 font-semibold text-right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                    <tr key={index} className="border-b">
                        <td className="p-3">
                        {item.itemName}
                        <span className="text-muted-foreground text-sm block">({item.unitCode})</span>
                        </td>
                        <td className="p-3 text-right">Rs. {item.price.toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </section>

            <section className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs. {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Paid</span>
                <span>Rs. {order.total.toLocaleString()}</span>
                </div>
            </div>
            </section>

            <footer className="mt-8 pt-4 border-t text-center text-muted-foreground text-sm">
            <p>Thank you for your purchase!</p>
            <p>If you have any questions, please contact us at +94 75 442 0805.</p>
            </footer>
        </div>
        
        <div className="mt-8 text-center">
            <Button onClick={handleDownloadPdf} disabled={isGenerating}>
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Download className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </Button>
        </div>
    </div>
  );
}
