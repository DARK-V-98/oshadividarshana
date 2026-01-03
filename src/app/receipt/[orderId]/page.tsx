
'use server';

import { doc, getDoc, getFirestore } from 'firebase/firestore';
import * as admin from 'firebase-admin';
import { notFound } from 'next/navigation';
import type { Order } from '@/lib/types';
import ReceiptClient from '@/components/ReceiptClient';
import type { Metadata } from 'next';

function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountString) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }
  const serviceAccount = JSON.parse(serviceAccountString);

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function getOrder(orderId: string): Promise<Order | null> {
  initAdmin();
  const db = getFirestore(admin.app());
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    return null;
  }

  const orderData = orderSnap.data();
  // Firestore timestamps need to be converted to serializable format for client components
  return {
    id: orderSnap.id,
    ...orderData,
    createdAt: orderData.createdAt.toDate().toISOString(),
  } as Order;
}

export async function generateMetadata({ params }: { params: { orderId: string } }): Promise<Metadata> {
  const order = await getOrder(params.orderId);
  
  if (!order) {
    return {
      title: 'Receipt Not Found',
    };
  }

  return {
    title: `Receipt for Order ${order.orderCode}`,
    description: `View and print the receipt for your order ${order.orderCode}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}


export default async function ReceiptPage({ params }: { params: { orderId: string } }) {
  const order = await getOrder(params.orderId);

  if (!order || order.status !== 'completed') {
    notFound();
  }

  return <ReceiptClient order={order} />;
}
