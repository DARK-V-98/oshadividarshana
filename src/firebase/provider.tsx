'use client';
import { firebaseConfig } from './config';
import { FirebaseClientProvider } from './client-provider';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider firebaseConfig={firebaseConfig}>
      {children}
    </FirebaseClientProvider>
  );
}
