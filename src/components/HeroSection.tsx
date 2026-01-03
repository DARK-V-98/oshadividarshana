
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, BookOpen, Crown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-x-hidden pt-20"
    >
      {/* Background Elements */}
      <Image 
        src="/bg.jpg"
        alt="Bridal makeup background"
        fill
        className="absolute inset-0 z-0 object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-0"/>
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl"
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 right-10 md:right-20 w-32 h-32 rounded-full bg-gold/20 blur-2xl"
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-5 md:right-10 w-16 h-16 rounded-full bg-rose-medium/30 blur-xl"
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating icons */}
      <motion.div
        className="absolute top-32 right-1/4 text-white/40"
        animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Crown className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/4 text-gold/50"
        animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-10 h-10" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-10 text-white/30"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-6 h-6 fill-current" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Professional Bridal Dresser & Beautician</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-4"
          >
            Oshadi Vidarshana
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            NVQ Level 4 Notes & Bridal Services. Your expert resource for NVQ Level 4 study materials and professional bridal services in Sri Lanka.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-rose-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all w-full sm:w-auto px-8 py-6 text-lg"
            >
              <a href="#categories">
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold text-gold hover:bg-gold/10 hover:text-gold w-full sm:w-auto px-8 py-6 text-lg"
            >
              <a href="#pricing">View Pricing</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto text-white"
          >
            {[
              { value: "50+", label: "Modules" },
              { value: "500+", label: "Students" },
              { value: "4.9", label: "Rating", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-playfair text-3xl md:text-4xl font-bold flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.icon && <Star className="w-5 h-5 text-gold fill-gold" />}
                </div>
                <div className="text-xs sm:text-sm text-white/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
