
"use client";
import { motion } from "framer-motion";
import Link from 'next/link';
import { Crown, Sparkles, Scissors, Package, FileText, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { pricingData } from "@/lib/data";

interface PricingItem {
  label: string;
  price: number;
  type: 'fullNote' | 'fullAssignment' | 'partialNote' | 'partialAssignment' | 'individualNote' | 'individualAssignment';
  count?: number;
  buttonText: string;
  category: string;
  medium: 'sinhala' | 'english';
}

const getItemType = (item: PricingItem) => {
    if (item.type.includes('Note')) return 'note';
    if (item.type.includes('Assignment')) return 'assignment';
    return 'note';
};

const PricingCard = ({ item, delay }: { item: PricingItem; delay: number }) => {
  const isFull = item.type.startsWith('full');
  const packType = getItemType(item);

  const getHref = () => {
    if (item.type.startsWith('full') || item.type.startsWith('individual')) {
        return '/order'; // Go to main order page to select
    }
    // For partial packs
    return `/order/${item.category.toLowerCase().replace(' ', '-')}-${item.medium}-${packType}-${item.count}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative bg-card border rounded-xl p-4 shadow-sm hover:shadow-lg transition-all flex flex-col ${
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
      
      <div className={`pt-2 flex-grow flex flex-col`}>
        <h4 className="font-medium text-foreground text-sm mb-2">{item.label}</h4>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-foreground">Rs. {item.price.toLocaleString()}</span>
        </div>
        <div className="mt-auto">
            <Button
            asChild
            size="sm"
            variant={isFull ? "default" : "outline"}
            className={`w-full ${isFull ? "bg-primary hover:bg-rose-dark" : "hover:bg-primary/5 hover:border-primary"}`}
            >
            <Link href={getHref()}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {item.buttonText}
            </Link>
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CategorySection = ({ category, medium }: { category: any; medium: 'sinhala' | 'english' }) => {
  const IconComponent = {
    'Bridal Dresser': Crown,
    'Beauty': Sparkles,
    'Hair Dresser': Scissors,
    'Extra Notes': FileText,
  }[category.name] || FileText;

  const items: PricingItem[] = category[medium].map((item: any) => ({
    ...item,
    category: category.name,
    medium: medium,
  }));
  
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
          {items.filter(i => i.type.startsWith('full')).map((item, idx) => (
            <PricingCard key={item.label} item={item} delay={idx * 0.1} />
          ))}
        </div>
        
        {/* Individual & Partial Packs */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Individual & Partial Packs
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
             {items.filter(i => i.type.startsWith('partial') || i.type.startsWith('individual')).map((item, idx) => (
               <PricingCard key={item.label} item={item} delay={idx * 0.05} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PricingSection = () => {
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
            Flexible options to fit your study needs and budget. Select a pack to get started.
          </p>
        </motion.div>


        {/* Pricing Categories */}
        <div className="space-y-12 max-w-5xl mx-auto">
            <div>
                <h3 className="font-playfair text-3xl font-bold text-foreground mb-8 text-center">
                    සිංහල Medium
                </h3>
                <div className="space-y-8">
                    {pricingData.map((category) => (
                    <CategorySection
                        key={`${category.name}-sinhala`}
                        category={{
                            ...category,
                            color: {
                                'Bridal Dresser': "from-primary to-rose-dark",
                                'Beauty': "from-rose-medium to-primary",
                                'Hair Dresser': "from-gold to-primary",
                                'Extra Notes': "from-primary to-gold",
                            }[category.name] || "from-primary to-rose-dark",
                        }}
                        medium="sinhala"
                    />
                    ))}
                </div>
            </div>

            <div className="border-t border-border pt-12">
                <h3 className="font-playfair text-3xl font-bold text-foreground mb-8 text-center">
                    English Medium
                </h3>
                <div className="space-y-8">
                    {pricingData.map((category) => (
                    <CategorySection
                        key={`${category.name}-english`}
                        category={{
                            ...category,
                             color: {
                                'Bridal Dresser': "from-primary to-rose-dark",
                                'Beauty': "from-rose-medium to-primary",
                                'Hair Dresser': "from-gold to-primary",
                                'Extra Notes': "from-primary to-gold",
                            }[category.name] || "from-primary to-rose-dark",
                        }}
                        medium="english"
                    />
                    ))}
                </div>
            </div>
        </div>

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
