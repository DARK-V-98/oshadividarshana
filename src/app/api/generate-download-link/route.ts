
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { FieldValue } from 'firebase-admin/firestore';

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
    initAdmin();
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
        if (!order || order.userId !== user.uid || order.status !== 'completed') {
            return NextResponse.json({ message: 'You do not have access to this item.' }, { status: 403 });
        }

        const itemIndex = order.items.findIndex((item: any) => item.unitId === unitId && item.itemType === itemType);

        if (itemIndex === -1) {
            return NextResponse.json({ message: 'Item not found in order.' }, { status: 404 });
        }
        
        const item = order.items[itemIndex];
        
        // Check if user has already downloaded
        if (item.downloads && item.downloads.includes(user.uid)) {
            return NextResponse.json({ message: 'You have already downloaded this file.' }, { status: 403 });
        }

        const unitDoc = await db.collection('units').doc(unitId).get();
        if (!unitDoc.exists) {
            return NextResponse.json({ message: 'Unit data not found.' }, { status: 404 });
        }
        const unit = unitDoc.data();
        if(!unit) {
             return NextResponse.json({ message: 'Unit data not found.' }, { status: 404 });
        }

        let pdfUrl: string | null = null;
        switch (itemType) {
            case 'sinhalaNote': pdfUrl = unit.pdfUrlSinhalaNote; break;
            case 'sinhalaAssignment': pdfUrl = unit.pdfUrlSinhalaAssignment; break;
            case 'englishNote': pdfUrl = unit.pdfUrlEnglishNote; break;
            case 'englishAssignment': pdfUrl = unit.pdfUrlEnglishAssignment; break;
        }

        if (!pdfUrl) {
            return NextResponse.json({ message: 'File not available for download.' }, { status: 404 });
        }

        // Generate a signed URL for the download
        const fileUrl = new URL(pdfUrl);
        const filePath = decodeURIComponent(fileUrl.pathname.split('/o/')[1].split('?')[0]);
        
        const bucket = getStorage().bucket();
        const file = bucket.file(filePath);
        
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

        // Update the order item to mark as downloaded for this user
        const updatedItems = [...order.items];
        const updatedItem = { ...updatedItems[itemIndex] };
        if (!updatedItem.downloads) {
            updatedItem.downloads = [];
        }
        updatedItem.downloads.push(user.uid);
        updatedItems[itemIndex] = updatedItem;
        
        await orderRef.update({ items: updatedItems });
        
        return NextResponse.json({ downloadUrl: signedUrl });

    } catch (error) {
        console.error('Download link generation error:', error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}
