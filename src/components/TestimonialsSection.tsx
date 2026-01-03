"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sanduni Perera",
    role: "Bride",
    text: "Oshadi made my wedding day absolutely perfect! The makeup was flawless and lasted all day. She understood my vision perfectly. Highly recommend!",
    rating: 5,
  },
  {
    name: "Nimali Fernando",
    role: "Beauty Student",
    text: "The best teacher for NVQ Level 4! Oshadi's practical guidelines helped me so much during my assessments. Thank you for your guidance!",
    rating: 5,
  },
  {
    name: "Hasini Jayawardena",
    role: "NVQ Student",
    text: "I bought the full note bundle and it was a lifesaver! Everything is so well-organized. The Sinhala explanations really helped me understand complex topics.",
    rating: 5,
  },
  {
    name: "Fathima Rizwan",
    role: "Beautician Trainee",
    text: "The assignment pack is worth every rupee. The sample answers are detailed and helped me structure my own assignments perfectly. Saved me so much time.",
    rating: 5,
  },
  {
    name: "Priya Silva",
    role: "Salon Owner",
    text: "Excellent service and professionalism. Oshadi did the makeup for my entire bridal party and everyone looked stunning. She's a true artist.",
    rating: 5,
  },
  {
    name: "Anusha Kumari",
    role: "NVQ Student",
    text: "I was struggling with the practicals, but the notes on Manicure & Pedicure and Facials were incredibly detailed. Passed my exam with flying colors!",
    rating: 5,
  },
  {
    name: "Madhavi Rajapaksa",
    role: "NVQ Student",
    text: "The full note bundle is the best investment for your studies. It covers every single unit in detail. Don't think twice, just get it!",
    rating: 5,
  },
  {
    name: "Shashikala Weerasinghe",
    role: "Beautician",
    text: "I recommend these notes to all my students now. It's the most comprehensive and reliable resource available for NVQ Level 4 in Sri Lanka.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
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
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};