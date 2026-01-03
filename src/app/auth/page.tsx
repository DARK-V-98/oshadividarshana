
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm";
import { Loader2 } from "lucide-react";
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Sign In / Sign Up',
  description: 'Access your student dashboard to manage orders and view purchased content, or create a new account.',
};

export default function AuthPage() {
  const [showSignIn, setShowSignIn] = useState(true);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleFlip = () => {
    setShowSignIn(!showSignIn);
  };
  
  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4 overflow-x-hidden">
      <div className="relative w-full max-w-md h-[680px]">
        <AnimatePresence initial={false} custom={showSignIn ? 1 : -1}>
            <motion.div
              key={showSignIn ? "signin" : "signup"}
              custom={showSignIn ? 1 : -1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                duration: 0.4
              }}
              className="absolute w-full h-full"
            >
              {showSignIn ? (
                <SignInForm onFlip={handleFlip} />
              ) : (
                <SignUpForm onFlip={handleFlip} />
              )}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
