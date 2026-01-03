
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useFirebase } from "@/firebase/client-provider";
import type { UserProfile } from "@/lib/types";

export function useUser() {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
      setLoading(true);
      if (userAuth) {
        setUser(userAuth);
        if (firestore) {
          const userDocRef = doc(firestore, "users", userAuth.uid);
          const unsubscribeProfile = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
              setUserProfile(snapshot.data() as UserProfile);
            } else {
              setUserProfile(null);
            }
            setLoading(false);
          }, (error) => {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
            setLoading(false);
          });
          return unsubscribeProfile; // This is the cleanup function for the profile listener
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return { user, userProfile, loading };
}
