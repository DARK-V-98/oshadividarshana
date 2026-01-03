"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useDoc } from "@/firebase";
import { SiteSettings } from "@/lib/types";

export const TestimonialsSection = () => {
  const { data: siteSettings, loading } = useDoc<SiteSettings>('settings/site');
  const testimonials = siteSettings?.testimonials || [];
  
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length > 1) {
        const timer = setInterval(() => {
          paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length]);

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-gradient">Students Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of satisfied students and brides who trusted us with their success
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative h-[320px] md:h-[280px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl h-full flex flex-col justify-center">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-foreground text-lg md:text-xl text-center leading-relaxed mb-6">
                    "{testimonials[current].text}"
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="text-center">
                    <p className="font-playfair text-lg font-semibold text-foreground">
                      {testimonials[current].name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors disabled:opacity-50"
              disabled={testimonials.length <= 1}
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors disabled:opacity-50"
              disabled={testimonials.length <= 1}
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
