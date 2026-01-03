
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm";
import { Loader2 } from "lucide-react";
import type { Metadata } from 'next';

// Although metadata can't be exported from a client component,
// we can define it here for reference or future conversion.
// For now, layout.tsx will handle the base metadata.
const metadata: Metadata = {
  title: 'Sign In / Sign Up',
  description: 'Access your student dashboard to manage orders and view purchased content, or create a new account.',
};

export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4">
      <div className="relative w-full max-w-md h-[680px]" style={{ perspective: "1000px" }}>
        <AnimatePresence>
          <motion.div
            className="absolute w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: 'hidden' }}
          >
           <div className="absolute w-full h-full" style={{backfaceVisibility: 'hidden'}}>
             <SignInForm onFlip={handleFlip} />
           </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            className="absolute w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 0 : -180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: 'hidden' }}
          >
            <div className="absolute w-full h-full" style={{backfaceVisibility: 'hidden'}}>
                <SignUpForm onFlip={handleFlip} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
