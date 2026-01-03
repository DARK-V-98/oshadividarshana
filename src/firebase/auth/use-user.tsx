
"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import type { UserProfile } from "@/lib/types";

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  const getIdToken = useCallback(async () => {
    if (!auth?.currentUser) return null;
    try {
        const token = await auth.currentUser.getIdToken(true); // Force refresh
        setIdToken(token);
        return token;
    } catch(error) {
        console.error("Error getting ID token:", error);
        setIdToken(null);
        return null;
    }
  }, [auth]);

  useEffect(() => {
    if (!auth || !firestore) {
        setLoading(false);
        return;
    }

    let profileUnsubscribe: Unsubscribe | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (!userAuth) {
        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = undefined;
        }
        setUser(null);
        setUserProfile(null);
        setIdToken(null);
        setLoading(false);
        return;
      }

      setUser(userAuth);
      await getIdToken(); // Get initial token
      
      const userDocRef = doc(firestore, "users", userAuth.uid);
      
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      profileUnsubscribe = onSnapshot(userDocRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            setUserProfile(null); 
          }
          setLoading(false);
        }, 
        (error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setLoading(false);
        }
      );
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [auth, firestore, getIdToken]);

  return { user, userProfile, loading, getIdToken, idToken };
}
