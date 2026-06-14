
'use client';

import { useDoc } from '@/firebase';
import { SiteSettings } from '@/lib/types';
import { Megaphone, X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Announcement() {
  const { data: siteSettings, loading } = useDoc<SiteSettings>('settings/site');
  const announcement = siteSettings?.announcement;

  const [showPopup, setShowPopup] = useState(false);
  const [barVisible, setBarVisible] = useState(true);

  useEffect(() => {
    if (!announcement?.enabled || !announcement?.message) return;
    try {
      const key = `ov_announcement_seen:${announcement.message}`;
      if (!localStorage.getItem(key)) {
        setShowPopup(true);
      }
    } catch {
      setShowPopup(true);
    }
  }, [announcement?.enabled, announcement?.message]);

  if (loading || !announcement?.enabled || !announcement?.message) {
    return null;
  }

  const message = announcement.message;

  const closePopup = () => {
    try {
      localStorage.setItem(`ov_announcement_seen:${message}`, '1');
    } catch {
      /* ignore */
    }
    setShowPopup(false);
  };

  const MarqueeGroup = () => (
    <div className="flex items-center shrink-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <Megaphone className="w-3.5 h-3.5 mx-3 shrink-0" />
          <span className="text-xs sm:text-sm font-medium pr-4">{message}</span>
          <Sparkles className="w-3 h-3 text-white/70 shrink-0" />
        </span>
      ))}
    </div>
  );

  return (
    <>
      {/* First-visit popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl border-t-4 border-primary overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-10 w-40 h-40 rounded-full bg-purple/10 blur-2xl" />

              <button
                onClick={closePopup}
                aria-label="Close"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                animate={{ rotate: [0, -12, 12, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mx-auto mb-5 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center shadow-lg"
              >
                <Megaphone className="w-8 h-8 text-white" />
              </motion.div>

              <span className="relative inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                Special Announcement
              </span>
              <p className="relative text-lg text-foreground leading-relaxed mb-6">
                {message}
              </p>
              <button
                onClick={closePopup}
                className="relative inline-flex items-center justify-center rounded-full bg-primary px-8 py-2.5 text-primary-foreground font-medium hover:bg-rose-dark transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thin animated bar under the navbar */}
      <AnimatePresence>
        {barVisible && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-gradient-to-r from-primary via-purple to-primary text-white shadow-md"
          >
            <div className="relative flex items-center h-8 overflow-hidden">
              <div className="flex w-max animate-marquee" style={{ animationDuration: '60s' }}>
                <MarqueeGroup />
                <MarqueeGroup />
              </div>
              <button
                onClick={() => setBarVisible(false)}
                aria-label="Dismiss announcement"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/15 hover:bg-black/30 rounded-full p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
