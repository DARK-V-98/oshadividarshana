import { motion } from "framer-motion";
import { Crown, Sparkles, Scissors, BookMarked, ArrowRight } from "lucide-react";

const categories = [
  {
    icon: Crown,
    title: "Bridal Dresser",
    description: "Master the art of bridal makeup, hair styling, and saree draping. Includes traditional and modern techniques.",
    modules: 20,
    color: "from-primary to-rose-dark",
    delay: 0,
  },
  {
    icon: Sparkles,
    title: "Beauty",
    description: "Comprehensive modules on skin care, facials, manicure, pedicure, and other essential beauty treatments.",
    modules: 12,
    color: "from-rose-medium to-primary",
    delay: 0.1,
  },
  {
    icon: Scissors,
    title: "Hair",
    description: "Learn professional hair cutting, coloring, and styling techniques for all types of hair.",
    modules: 17,
    color: "from-gold to-primary",
    delay: 0.2,
  },
  {
    icon: BookMarked,
    title: "Extra Notes",
    description: "Specialized notes covering salon management, health & safety, etiquette, and more to round out your skills.",
    modules: 10,
    color: "from-primary to-gold",
    delay: 0.3,
  },
];

export const CategoriesSection = () => {
  return (
    <section id="categories" className="py-24 bg-muted/30">
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
            Course Categories
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            What You'll <span className="text-gradient">Learn</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive study materials designed specifically for NVQ Level 4 students in Sri Lanka
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: category.delay }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-card rounded-2xl p-6 shadow-lg border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-3">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {category.modules} Modules
                </span>
                <motion.div
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <ArrowRight className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                </motion.div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
