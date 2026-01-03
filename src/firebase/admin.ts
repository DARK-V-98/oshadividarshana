
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

export async function initAdmin() {
    if (admin.apps.length > 0) {
      return admin.app();
    }
  
    if (!serviceAccount) {
        throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable.')
    }

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
}
