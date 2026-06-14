"use client";
import { motion } from "framer-motion";
import { BookOpen, Printer, Palette, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: Palette, label: "Full Colour Printing" },
  { icon: BookOpen, label: "Professionally Bound" },
  { icon: Printer, label: "Delivered as a Book" },
];

export const PrintBindSection = () => {
  return (
    <section id="print-bind" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple to-purple-dark p-8 md:p-12 shadow-2xl"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-56 h-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                Printed & Bound
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
                Want Your Notes as a Real Book?
              </h2>
              <p className="text-white/90 leading-relaxed mb-6">
                All our notes and customized projects can also be supplied as
                full-colour printed and professionally bound books — perfect for
                studying and keeping. Contact us for printing &amp; binding details.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {perks.map((perk) => (
                  <span
                    key={perk.label}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-sm"
                  >
                    <perk.icon className="w-4 h-4" />
                    {perk.label}
                  </span>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <a href="https://wa.me/94754420805" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact for Printing Details
                </a>
              </Button>
            </div>

            {/* Visual */}
            <div className="hidden md:flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0], y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-44 h-56 rounded-2xl bg-white/95 shadow-2xl flex flex-col items-center justify-center gap-3 border-l-8 border-purple-dark"
              >
                <BookOpen className="w-16 h-16 text-primary" />
                <span className="font-playfair text-lg font-bold text-foreground">
                  NVQ Level 4
                </span>
                <span className="text-xs text-muted-foreground">Notes &amp; Projects</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
