
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

  useEffect(() => {
    if (!auth || !firestore) {
        setLoading(false);
        return;
    }

    let profileUnsubscribe: Unsubscribe | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, (userAuth) => {
      // If the user logs out, clean up everything.
      if (!userAuth) {
        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = undefined;
        }
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      // If the user is logged in, set the user object and listen for profile changes.
      setUser(userAuth);
      
      const userDocRef = doc(firestore, "users", userAuth.uid);
      
      // Clean up previous listener before starting a new one
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      profileUnsubscribe = onSnapshot(userDocRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            // This can happen if the user doc hasn't been created yet
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

    // Cleanup function for the useEffect hook
    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [auth, firestore]);

  return { user, userProfile, loading };
}
