
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Query,
  type DocumentData,
  type WhereFilterOp,
  and,
} from "firebase/firestore";
import { useFirebase } from "@/firebase/client-provider";

type WhereClause = [string, WhereFilterOp, any];

export function useCollection<T>(path: string | undefined, options?: {
  where?: WhereClause | WhereClause[];
}) {
  const { firestore } = useFirebase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the where clauses to prevent re-renders
  const whereClauses = useMemo(() => {
    if (!options?.where) return [];
    // Ensure it's always an array of arrays
    if (Array.isArray(options.where[0])) {
      return options.where as WhereClause[];
    }
    return [options.where] as WhereClause[];
  }, [options?.where]);

  useEffect(() => {
    // Exit early if firestore or path is not ready
    if (!firestore || !path) {
        setLoading(false);
        setData([]);
        return;
    };
    
    // Check if any where clause value is undefined
    const isReady = whereClauses.every(clause => clause[2] !== undefined);
    if (!isReady) {
      setLoading(false);
      setData([]);
      return;
    }

    let q: Query<DocumentData>;
    const collectionRef = collection(firestore, path);
    
    if (whereClauses.length > 0) {
        const queryConstraints = whereClauses.map(clause => where(...clause));
        q = query(collectionRef, ...queryConstraints);
    } else {
        q = query(collectionRef);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, path, JSON.stringify(whereClauses)]); // Deep comparison for whereClauses

  return { data, loading, error };
}
