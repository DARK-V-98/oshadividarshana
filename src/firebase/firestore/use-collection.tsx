
"use client";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Query,
  type DocumentData,
} from "firebase/firestore";
import { useFirebase } from "@/firebase/client-provider";

export function useCollection<T>(path: string | undefined, options?: {
  where?: [string, "==", any];
}) {
  const { firestore } = useFirebase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore || !path) {
        setLoading(false);
        setData([]);
        return;
    };

    let q: Query<DocumentData>;
    if (options?.where) {
      q = query(collection(firestore, path), where(...options.where));
    } else {
      q = query(collection(firestore, path));
    }
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // Ensure where clause is stable or memoized if it's an array/object
  }, [firestore, path, options?.where]);

  return { data, loading, error };
}
