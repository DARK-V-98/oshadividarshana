
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Scissors, Package, FileText, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type MediumType = "sinhala" | "english";

interface PricingItem {
  label: string;
  price: number;
  type: "full" | "individual" | "partial";
  count?: number;
  buttonText: string;
}

interface CategoryPricing {
  name: string;
  icon: typeof Crown;
  modules: number;
  color: string;
  sinhala: PricingItem[];
  english: PricingItem[];
}

const pricingData: CategoryPricing[] = [
  {
    name: "Bridal Dresser",
    icon: Crown,
    modules: 20,
    color: "from-primary to-rose-dark",
    sinhala: [
      { label: "Full Note Pack (20)", price: 5800, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (20)", price: 7800, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 800, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1400, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 1800, type: "partial", count: 5, buttonText: "Select Items" },
    ],
    english: [
      { label: "Full Note Pack (20)", price: 7800, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (20)", price: 9800, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 500, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1400, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1900, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 2400, type: "partial", count: 5, buttonText: "Select Items" },
    ],
  },
  {
    name: "Beauty",
    icon: Sparkles,
    modules: 12,
    color: "from-rose-medium to-primary",
    sinhala: [
      { label: "Full Note Pack (12)", price: 3500, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (12)", price: 4700, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 800, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1400, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 1800, type: "partial", count: 5, buttonText: "Select Items" },
    ],
    english: [
      { label: "Full Note Pack (12)", price: 4600, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (12)", price: 5700, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 500, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1400, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1900, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 2400, type: "partial", count: 5, buttonText: "Select Items" },
    ],
  },
  {
    name: "Hair Dresser",
    icon: Scissors,
    modules: 17,
    color: "from-gold to-primary",
    sinhala: [
      { label: "Full Note Pack (17)", price: 5000, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (17)", price: 6600, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 800, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1400, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 1800, type: "partial", count: 5, buttonText: "Select Items" },
    ],
    english: [
      { label: "Full Note Pack (17)", price: 6600, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (17)", price: 8300, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 500, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1400, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1900, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 2400, type: "partial", count: 5, buttonText: "Select Items" },
    ],
  },
];

const PricingCard = ({ item, delay }: { item: PricingItem; delay: number }) => {
  const isFull = item.type === "full";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative bg-card border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all ${
        isFull ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : "border-border"
      }`}
    >
      {isFull && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            <Package className="w-3 h-3" />
            Full Pack
          </span>
        </div>
      )}
      
      <div className={`${isFull ? "pt-2" : ""}`}>
        <h4 className="font-medium text-foreground text-sm mb-2">{item.label}</h4>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-foreground">Rs. {item.price.toLocaleString()}</span>
        </div>
        <Button
          asChild
          size="sm"
          variant={isFull ? "default" : "outline"}
          className={`w-full ${isFull ? "bg-primary hover:bg-rose-dark" : "hover:bg-primary/5 hover:border-primary"}`}
        >
          <a href="https://wa.me/94754420805" target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {item.buttonText}
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

const CategorySection = ({ category, medium }: { category: CategoryPricing; medium: MediumType }) => {
  const items = medium === "sinhala" ? category.sinhala : category.english;
  const IconComponent = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${category.color} p-6`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-playfair text-2xl font-bold text-white">{category.name}</h3>
            <p className="text-white/80 text-sm">{category.modules} Modules Available</p>
          </div>
        </div>
      </div>
      
      {/* Pricing Grid */}
      <div className="p-6">
        {/* Full Packs */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {items.filter(i => i.type === "full").map((item, idx) => (
            <PricingCard key={item.label} item={item} delay={idx * 0.1} />
          ))}
        </div>
        
        {/* Individual & Partial Packs */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Individual & Partial Packs
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {items.filter(i => i.type !== "full").map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-muted/50 border border-border rounded-xl p-3 text-center hover:border-primary/30 transition-all"
              >
                <p className="text-xs font-medium text-foreground mb-1">{item.label}</p>
                <p className="text-lg font-bold text-primary mb-2">Rs. {item.price.toLocaleString()}</p>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="w-full h-8 text-xs hover:bg-primary/10 hover:text-primary"
                >
                  <a href="https://wa.me/94754420805" target="_blank" rel="noopener noreferrer">
                    {item.buttonText}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PricingSection = () => {
  const [activeMedium, setActiveMedium] = useState<MediumType>("sinhala");

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="text-gradient">Package</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Flexible options to fit your study needs and budget.
          </p>
        </motion.div>

        {/* Medium Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-card border border-border rounded-full p-1.5 shadow-lg">
            {(["sinhala", "english"] as MediumType[]).map((medium) => (
              <button
                key={medium}
                onClick={() => setActiveMedium(medium)}
                className={`relative px-6 py-3 rounded-full font-medium transition-all ${
                  activeMedium === medium
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeMedium === medium && (
                  <motion.div
                    layoutId="activeMedium"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {medium === "sinhala" ? "සිංහල Medium" : "English Medium"}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Categories */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMedium}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {pricingData.map((category) => (
              <CategorySection
                key={category.name}
                category={category}
                medium={activeMedium}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 space-y-4 max-w-3xl mx-auto"
        >
          <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
            <AlertTitle className="font-semibold !text-yellow-800 dark:!text-yellow-300">A Note on Usage</AlertTitle>
            <AlertDescription>
              These materials are created with love and care for your personal learning journey. Please do not resell or redistribute them. We take the protection of our intellectual property seriously and will pursue legal action against unauthorized distribution.
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground text-sm">
            All prices are in Sri Lankan Rupees (LKR)
          </p>
          <p className="text-muted-foreground text-sm">
            Contact via WhatsApp to place your order and arrange payment
          </p>
        </motion.div>
      </div>
    </section>
  );
};
