
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

async function getAdminFromToken(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Check for admin role
        if (decodedToken.role === 'admin') {
            return decodedToken;
        }
        return null;
    } catch (error) {
        console.error('Error verifying admin token:', error);
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
        initAdmin();
        const adminUser = await getAdminFromToken(req);

        if (!adminUser) {
            return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ message: 'Missing orderId.' }, { status: 400 });
        }

        const db = admin.firestore();
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
        }

        const order = orderDoc.data();
        if (!order) {
             return NextResponse.json({ message: 'Order data is invalid.' }, { status: 500 });
        }

        const bucket = getStorage().bucket();
        const updatedItems = [];

        for (const item of order.items) {
            const originalFileName = itemTypeToFileName(item.itemType);
            if (!originalFileName) continue;
            
            const originalFilePath = `units/${item.unitId}/${originalFileName}`;
            const userFilePath = `user-content/${order.userId}/${order.id}/${item.unitId}-${item.itemType}.pdf`;

            const originalFile = bucket.file(originalFilePath);
            const [exists] = await originalFile.exists();
            if (!exists) {
                console.warn(`Original file not found, skipping copy: ${originalFilePath}`);
                // Still add the item to the list, but without a URL
                 updatedItems.push({
                    ...item,
                    userFileUrl: null,
                });
                continue;
            }

            // Copy the file
            await originalFile.copy(bucket.file(userFilePath));

            updatedItems.push({
                ...item,
                userFileUrl: userFilePath, // Store the path to the user's copy
            });
        }
        
        // Update the order with the new item data and set status to completed
        await orderRef.update({
            items: updatedItems,
            status: 'completed'
        });
        
        return NextResponse.json({ message: `Successfully created ${updatedItems.length} user files for order ${orderId}.` });

    } catch (error: any) {
        console.error('File copy process error:', error);
        return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
