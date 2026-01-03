'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import {
  getAuth,
  type Auth,
} from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

/**
 * Context for the Firebase app instance.
 */
export const FirebaseAppContext = createContext<FirebaseApp | undefined>(
  undefined,
);

/**
 * Context for the Firebase services.
 */
export const FirebaseContext = createContext<{
  auth?: Auth;
  firestore?: Firestore;
}>({});

/**
 * Initializes Firebase on the client-side and provides the Firebase app instance and services to children.
 */
export function FirebaseClientProvider({
  children,
  firebaseConfig,
}: {
  children: ReactNode;
  firebaseConfig: FirebaseOptions;
}) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>();
  const [auth, setAuth] = useState<Auth>();
  const [firestore, setFirestore] = useState<Firestore>();

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      setFirebaseApp(app);
      setAuth(getAuth(app));
      setFirestore(getFirestore(app));
    } catch (e) {
      console.error(
        'Failed to initialize Firebase. This can happen if you are using Next.js with React Server Components.'
      );
    }
  }, [firebaseConfig]);

  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
      <FirebaseContext.Provider value={{ auth, firestore }}>
        {children}
      </FirebaseContext.Provider>
    </FirebaseAppContext.Provider>
  );
}

/**
 * Provides access to the Firebase app instance.
 */
export const useFirebaseApp = () => {
  return useContext(FirebaseAppContext);
};

/**
 * Provides access to the Firebase services.
 */
export const useFirebase = () => {
  return useContext(FirebaseContext);
};
