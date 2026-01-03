import {
  useFirebaseApp,
  useFirebase,
} from './client-provider';
import { FirebaseProvider } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const useAuth = (): Auth | undefined => useFirebase().auth;
const useFirestore = (): Firestore | undefined => useFirebase().firestore;

export {
  FirebaseProvider,
  useFirebaseApp,
  useFirebase,
  useUser,
  useAuth,
  useFirestore,
  useCollection,
  useDoc,
  getAuth,
  getFirestore
};
