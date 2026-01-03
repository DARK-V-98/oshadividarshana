
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm";

export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

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
