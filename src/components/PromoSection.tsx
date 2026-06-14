"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Crown, Sparkles, Scissors, Tag, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const promoOffers = [
  {
    name: "Beauty",
    icon: Sparkles,
    oldPrice: 2500,
    newPrice: 1500,
    color: "from-rose-medium to-primary",
    href: "/courses/beauty",
  },
  {
    name: "Hair",
    icon: Scissors,
    oldPrice: 2600,
    newPrice: 1500,
    color: "from-purple to-primary",
    href: "/courses/hair",
  },
  {
    name: "Bridal",
    icon: Crown,
    oldPrice: 3000,
    newPrice: 1800,
    color: "from-primary to-purple-dark",
    href: "/courses/bridal",
  },
];

export const PromoSection = () => {
  return (
    <section
      id="promo"
      className="py-20 bg-gradient-to-b from-background via-purple-soft/30 to-background"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Flame className="w-4 h-4" />
            Special Offers This Month
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Mega <span className="text-gradient">Project Deals</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Get our customized NVQ Level 4 projects at the lowest prices of the season — limited to this month only.
          </p>
        </motion.div>

        {/* Offer Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {promoOffers.map((offer, index) => {
            const savings = offer.oldPrice - offer.newPrice;
            return (
              <motion.div
                key={offer.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col"
              >
                {/* Discount ribbon */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                    <Tag className="w-3 h-3" />
                    Save Rs. {savings.toLocaleString()}
                  </span>
                </div>

                {/* Header */}
                <div className={`bg-gradient-to-br ${offer.color} p-6 flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <offer.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl font-bold text-white">
                      {offer.name}
                    </h3>
                    <p className="text-white/80 text-sm">Customized Project</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-primary">
                      Rs. {offer.newPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      Rs. {offer.oldPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    New offer price for this month
                  </p>

                  <Button
                    asChild
                    className="w-full mt-auto bg-primary hover:bg-rose-dark text-primary-foreground"
                  >
                    <Link href={offer.href}>
                      Order This Project
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          * Offer valid for this month only. Prices are in Sri Lankan Rupees (LKR).
        </motion.p>
      </div>
    </section>
  );
};
