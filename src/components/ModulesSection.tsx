
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Crown, Scissors, Sparkles, FileText, BookMarked } from "lucide-react";
import { moduleCategories } from "@/lib/data";

export const ModulesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("bridal-dresser");

  return (
    <section id="modules" className="py-24 bg-background">
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
            Course Modules
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Complete <span className="text-gradient">Syllabus Coverage</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All NVQ Level 4 modules with English titles and Sinhala translations for easy understanding
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {moduleCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory === category.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {category.modules.length}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${
                activeCategory === category.id ? "rotate-180" : ""
              }`} />
            </motion.button>
          ))}
        </div>

        {/* Module List */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg">
                <div className={`h-2 bg-gradient-to-r ${
                  moduleCategories.find(c => c.id === activeCategory)?.color
                }`} />
                <div className="p-6">
                  <div className="grid gap-3">
                    {moduleCategories
                      .find((c) => c.id === activeCategory)
                      ?.modules.map((module, index) => (
                        <motion.div
                          key={module.code}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {module.code}
                              </span>
                            </div>
                            <h4 className="font-medium text-foreground text-sm md:text-base">
                              {module.title}
                            </h4>
                            <p className="text-muted-foreground text-xs md:text-sm mt-1">
                              {module.sinhala}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
