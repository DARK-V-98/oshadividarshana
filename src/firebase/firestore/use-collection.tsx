
"use client";
import { useState, useEffect, useMemo } from "react";
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

  // Memoize the where clause to prevent re-renders
  const whereClause = useMemo(() => options?.where, [options?.where && options.where[2]]);

  useEffect(() => {
    // Exit early if firestore, path, or the value in the where clause is not ready
    if (!firestore || !path || (whereClause && whereClause[2] === undefined)) {
        setLoading(false);
        setData([]);
        return;
    };

    let q: Query<DocumentData>;
    if (whereClause) {
      q = query(collection(firestore, path), where(...whereClause));
    } else {
      q = query(collection(firestore, path));
    }
    
    setLoading(true);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("useCollection error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, whereClause]);

  return { data, loading, error };
}
