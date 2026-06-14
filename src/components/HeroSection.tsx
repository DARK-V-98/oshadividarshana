
"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Sparkles,
  Star,
  FileText,
  GraduationCap,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const featurePills = [
  { icon: FileText, label: "Ready-made Notes" },
  { icon: GraduationCap, label: "Customized Projects" },
  { icon: ShieldCheck, label: "NVQ Level 4 Focused" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20"
    >
      {/* Soft gradient wash */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-white to-purple-soft/40" />

      {/* Morphing gradient blobs */}
      <motion.div
        className="absolute -top-10 left-4 md:left-24 w-64 h-64 bg-gradient-to-br from-primary/25 to-rose-medium/10 blur-3xl animate-blob"
        animate={{ x: [-10, 20, -10], y: [-10, 15, -10] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-4 right-2 md:right-24 w-72 h-72 bg-gradient-to-br from-purple/25 to-primary/10 blur-3xl animate-blob"
        animate={{ x: [10, -20, 10], y: [10, -15, 10] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating icons */}
      <motion.div
        className="absolute top-28 right-[18%] text-primary/30 animate-float-slow hidden sm:block"
        animate={{ rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Crown className="w-9 h-9" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-[14%] text-purple/40 animate-float-slow hidden sm:block"
        animate={{ rotate: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-11 h-11" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-[8%] text-rose-medium/50"
        animate={{ y: [-8, 8, -8], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-6 h-6 fill-current" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen className="w-4 h-4" />
            </motion.span>
            <span className="text-sm font-medium">
              NVQ Level 4 Notes & Customized Student Projects
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={item}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold text-foreground leading-tight mb-4"
          >
            Oshadi <span className="text-gradient-animated">Vidarshana</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={item}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            We don&apos;t run courses — we provide ready-made NVQ Level 4 student
            notes and customized projects, crafted module by module to help you
            complete your assessments with confidence.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {featurePills.map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-sm font-medium text-foreground"
              >
                <pill.icon className="w-4 h-4 text-purple-dark" />
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group bg-primary hover:bg-rose-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all w-full sm:w-auto px-8 py-6 text-lg"
            >
              <a href="#categories">
                Explore Notes & Projects
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple text-purple-dark hover:bg-purple/10 hover:text-purple-dark w-full sm:w-auto px-8 py-6 text-lg"
            >
              <a href="#promo">View This Month&apos;s Offers</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto text-foreground"
          >
            {[
              { value: "50+", label: "Modules" },
              { value: "500+", label: "Students" },
              { value: "4.9", label: "Rating", icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06 }}
                className="text-center rounded-2xl py-3"
              >
                <div className="font-playfair text-3xl md:text-4xl font-bold flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.icon && <Star className="w-5 h-5 text-gold fill-gold" />}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#promo"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { duration: 1.6, repeat: Infinity } }}
        aria-label="Scroll down"
      >
        <ChevronDown className="w-7 h-7" />
      </motion.a>
    </section>
  );
};
