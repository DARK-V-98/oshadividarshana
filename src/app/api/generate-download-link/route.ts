
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import type { Order, CartItem } from '@/lib/types';

// Initialize Firebase Admin SDK
function initAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

async function getUserFromToken(req: NextRequest) {
    initAdmin(); // Ensure admin is initialized
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying user token:', error);
        return null;
    }
}

const itemTypeToFileName = (itemType: string): string | null => {
    switch (itemType) {
        case 'sinhalaNote': return 'sinhala-note.pdf';
        case 'sinhalaAssignment': return 'sinhala-assignment.pdf';
        case 'englishNote': return 'english-note.pdf';
        case 'englishAssignment': return 'english-assignment.pdf';
        default: return null;
    }
};

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized. Invalid or missing user token.' }, { status: 403 });
        }

        const { orderId, unitId, itemType } = await req.json();

        if (!orderId || !unitId || !itemType) {
            return NextResponse.json({ message: 'Missing required parameters.' }, { status: 400 });
        }

        const db = getFirestore();
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
        }

        const order = orderDoc.data() as Order;

        // Security checks
        if (order.userId !== user.uid) {
            return NextResponse.json({ message: 'Forbidden. You do not own this order.' }, { status: 403 });
        }
        if (order.status !== 'completed') {
            return NextResponse.json({ message: 'Forbidden. Order is not marked as completed.' }, { status: 403 });
        }
        const item = order.items.find(i => i.unitId === unitId && i.itemType === itemType);
        if (!item) {
            return NextResponse.json({ message: 'Item not found in this order.' }, { status: 404 });
        }
        
        const originalFileName = itemTypeToFileName(item.itemType);
        if (!originalFileName) {
            return NextResponse.json({ message: 'Invalid item type.' }, { status: 400 });
        }
        
        const originalFilePath = `units/${item.unitId}/${originalFileName}`;
        
        const bucket = getStorage().bucket();
        const file = bucket.file(originalFilePath);

        const [exists] = await file.exists();
        if (!exists) {
            return NextResponse.json({ message: 'File not found in storage. Please contact support.' }, { status: 404 });
        }

        // Generate a signed URL that expires in 15 minutes.
        const [downloadUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });
        
        return NextResponse.json({ downloadUrl });

    } catch (error: any) {
        console.error('Download link generation error:', error);
        return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
