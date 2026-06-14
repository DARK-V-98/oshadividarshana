"use client";
import { motion } from "framer-motion";
import { Sparkles, MapPin, MessageCircle, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

const nailServices = [
  { name: "Gel Extension", price: 3000 },
  { name: "Acrylic Nails", price: 3000 },
  { name: "Builder Gel Overlay", price: 2500 },
  { name: "Gel-X Set", price: 2000 },
  { name: "Nail Art Design", price: 500 },
  { name: "Nail Refill", price: 1500 },
  { name: "Nail Polish Change", price: 1000 },
  { name: "Nail Removal", price: 1200 },
];

export const NailsSection = () => {
  return (
    <section id="nails" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Gem className="w-4 h-4" />
            Nails by OV
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Professional <span className="text-gradient">Nail Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Beautiful, long-lasting nails done by Oshadi. Visit us for gel, acrylic, and custom nail art.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden"
          >
            {/* Header strip */}
            <div className="bg-gradient-to-r from-primary via-purple to-primary p-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-white" />
              <h3 className="font-playfair text-2xl font-bold text-white">Price List</h3>
            </div>

            {/* Services list */}
            <div className="divide-y divide-border">
              {nailServices.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple" />
                    <span className="font-medium text-foreground">{service.name}</span>
                  </div>
                  <span className="font-playfair text-lg font-bold text-primary">
                    Rs. {service.price.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Location + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary rounded-2xl p-6"
          >
            <div className="flex items-start gap-3 text-center sm:text-left">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Visit Us</p>
                <p className="text-muted-foreground text-sm">
                  618 Jana Jaya City Building, Rajagiriya
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shrink-0"
            >
              <a href="https://wa.me/94754420805" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Book an Appointment
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
