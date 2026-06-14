"use client";
import { motion } from "framer-motion";
import { MousePointerClick, MessageCircle, Wallet, Unlock } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Choose Your Items",
    description: "Browse the notes and customized projects you need and add them to your order.",
  },
  {
    icon: MessageCircle,
    title: "Message on WhatsApp",
    description: "Send us your order on WhatsApp — we'll confirm the details and pricing with you.",
  },
  {
    icon: Wallet,
    title: "Make Payment",
    description: "Complete the simple bank payment using the details we share with you.",
  },
  {
    icon: Unlock,
    title: "Unlock & Download",
    description: "Access your files instantly from your dashboard once the order is confirmed.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Get Your Materials in <span className="text-gradient">4 Easy Steps</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Simple from start to finish — order, confirm on WhatsApp, pay, and unlock.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-purple/40 to-primary/30" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative text-center"
              >
                <div className="relative inline-flex">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center mx-auto shadow-lg"
                  >
                    <step.icon className="w-9 h-9 text-white" />
                  </motion.div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-primary text-primary text-sm font-bold flex items-center justify-center shadow">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-playfair text-xl font-semibold text-foreground mt-6 mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
