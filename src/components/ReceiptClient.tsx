
'use client';

import type { Order } from '@/lib/types';
import ReceiptView from '@/components/dashboard/ReceiptView';

export default function ReceiptClient({ order }: { order: Order }) {
  
  // Convert timestamp if it's a Firestore Timestamp object
  const normalizedOrder = {
    ...order,
    createdAt: typeof order.createdAt === 'string' 
      ? order.createdAt 
      : (order.createdAt as any).toDate().toISOString(),
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto max-w-3xl">
        <ReceiptView order={normalizedOrder} />
      </div>
    </div>
  );
}
