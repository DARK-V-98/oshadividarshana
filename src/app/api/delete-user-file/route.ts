
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        initAdmin();
        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, unitId, itemType } = await req.json();

        if (!orderId || !unitId || !itemType) {
            return NextResponse.json({ message: 'Missing required parameters.' }, { status: 400 });
        }
        
        const db = admin.firestore();
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
        }

        const order = orderDoc.data();
        if (!order || order.userId !== user.uid) {
            return NextResponse.json({ message: 'You do not have access to this item.' }, { status: 403 });
        }

        const itemIndex = order.items.findIndex((item: any) => item.unitId === unitId && item.itemType === itemType);
        if (itemIndex === -1) {
            return NextResponse.json({ message: 'Item not found in order.' }, { status: 404 });
        }
        
        const item = order.items[itemIndex];
        if (!item.userFileUrl) {
            return NextResponse.json({ message: 'File has no user-specific copy.' }, { status: 400 });
        }

        // Delete the file from storage
        const bucket = getStorage().bucket();
        await bucket.file(item.userFileUrl).delete();

        // Update the item in the order to mark as downloaded
        const updatedItems = [...order.items];
        updatedItems[itemIndex] = { ...item, downloaded: true };
        
        await orderRef.update({ items: updatedItems });
        
        return NextResponse.json({ message: 'File successfully deleted after download.' });

    } catch (error: any) {
        console.error('File deletion error:', error);
        // If the file was already deleted, it's not a critical server error.
        if (error.code === 404) {
             return NextResponse.json({ message: 'File was already deleted.' }, { status: 200 });
        }
        return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
