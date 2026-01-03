import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Crown, Scissors, Sparkles, FileText } from "lucide-react";

const moduleCategories = [
  {
    id: "bridal",
    name: "Bridal Dresser",
    icon: Crown,
    color: "from-primary to-rose-dark",
    modules: [
      { code: "BD-M01", title: "Special Qualities to be Inculcated & Attitudes to be Developed", sinhala: "රූපලාවන්‍ය ශිල්පියෙකුට වර්ධනය කළ යුතු විශේෂ ගුණාංග සහ ආකල්ප" },
      { code: "BD-M02", title: "Analyse Skin", sinhala: "සම විශ්ලේෂණය" },
      { code: "BD-M03", title: "Facial", sinhala: "මුහුණු සත්කාර" },
      { code: "BD-M05", title: "Remove Superfluous Hair", sinhala: "අනවශ්‍ය රෝම ඉවත් කිරීම" },
      { code: "BD-M06", title: "Care Hands & Nails (Manicure)", sinhala: "අත් අලංකරණය" },
      { code: "BD-M07", title: "Care Feet & Nails (Pedicure)", sinhala: "පා අලංකරණය" },
      { code: "BD-M08", title: "Shampoo & conditioning hair", sinhala: "Shampoo කිරීම සහ condition කිරීම" },
      { code: "BD-M09", title: "Treat Scalp & Hair", sinhala: "හිසකෙස් සත්කාර" },
      { code: "BD-M10", title: "Style Hair and techniques", sinhala: "කොණ්ඩා මෝස්තර සහ තාක්ෂණය" },
      { code: "BD-M11", title: "Makeup", sinhala: "මේකප්" },
      { code: "BD-M12", title: "Bridal attire and its draping", sinhala: "මංගල ඇදුම් සහ එය ඇන්දවීම" },
      { code: "BD-M13", title: "Bridal dresser", sinhala: "මනාලියන් ඇන්දවීම" },
      { code: "BD-M14", title: "Occupational Health & Safety", sinhala: "සෞඛ්‍ය සහ ආරක්ෂාව" },
      { code: "BD-M15", title: "Client Consultation", sinhala: "සේවාලාභී උපදේශනය" },
      { code: "BD-M16", title: "Management of Salon", sinhala: "රූපලාවන්‍යාගාර කළමනාකරණය" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: Sparkles,
    color: "from-rose-medium to-primary",
    modules: [
      { code: "BM 01", title: "Special Qualities & Attitudes for a Beautician", sinhala: "රූපලාවන්‍ය ශිල්පියෙකුට වර්ධනය කළ යුතු විශේෂ ගුණාංග සහ ආකල්ප" },
      { code: "BM 02", title: "Maintain Tools & Equipment", sinhala: "මෙවලම් සහ උපකරණ නඩත්තු කිරීම" },
      { code: "BM 03", title: "Practice Occupational Health & Safety Measures", sinhala: "වෘත්තීය සෞඛ්‍ය සහ ආරක්ෂිත ක්‍රියාමාර්ග" },
      { code: "M01", title: "Maintain Safe & Pleasant Salon Environment", sinhala: "ආරක්ෂිත සහ සුහද රූපලාවන්‍යාගාර පරිසරය නඩත්තතුව" },
      { code: "M02", title: "Reception Duties", sinhala: "පිළිගැනීමේ රාජකාරි" },
      { code: "M03", title: "Client Consultation", sinhala: "සේවාලාභී උපදේශනය" },
      { code: "M04", title: "Remove Superfluous Hair", sinhala: "අනවශ්‍ය රෝම ඉවත් කිරීම" },
      { code: "M05", title: "Perform Make-up Activities", sinhala: "මේකප්" },
      { code: "M06", title: "Manicure & Pedicure", sinhala: "අත් අලංකරණය සහ පා අලංකරණය" },
      { code: "M07", title: "Analyze Skin", sinhala: "සම විශ්ලේෂණය" },
      { code: "M08", title: "Skin Care Treatments (facial)", sinhala: "සම් සත්කාර ප්‍රතිකාර" },
      { code: "M08-2", title: "Salon Management", sinhala: "රූපලාවන්‍යාගාර කළමනාකරණය" },
    ],
  },
  {
    id: "hair",
    name: "Hair Dresser",
    icon: Scissors,
    color: "from-gold to-primary",
    modules: [
      { code: "HD-M01", title: "Special qualities & attitudes to be developed by a Hairdresser", sinhala: "කොණ්ඩ මෝස්තර ශිල්පියෙකු විසින් ප්‍රගුණ කළ යුතු ගුණාංග" },
      { code: "HD-M02", title: "Maintain Machinery, Tools and Equipment", sinhala: "යන්ත්‍ර, උපකරණ හා භාණ්ඩ නඩත්තුව" },
      { code: "HD-M03", title: "Shampoo & conditioning hair", sinhala: "හිසකෙස් shampoo කිරීම හා condition කිරීම" },
      { code: "HD-M04", title: "Maintain safe & pleasant salon environment", sinhala: "පරිසර නඩත්තුව" },
      { code: "HD-M05", title: "Client's consultation services", sinhala: "සේවාලාභී උපදේශනය" },
      { code: "HD-M06", title: "Hair & scalp treatments", sinhala: "හිසකෙස් සහ scalp සත්කාර" },
      { code: "HD-M07", title: "Cutting & setting ladies hair", sinhala: "කාන්තා හිසකෙස් කැපීම හා සැකසීම" },
      { code: "HD-M08", title: "Cutting & setting men's hair, moustache & beard", sinhala: "පිරිමි හිසකෙස් කැපීම හා සැකසීම සහ රැවුල" },
      { code: "HD-M09", title: "Styling & dressing hair", sinhala: "හිසකෙස් මෝස්තර හා සැකසීම" },
      { code: "HD-M10", title: "Permanent wave (perm)", sinhala: "පර්ම් කිරීම" },
      { code: "HD-M11", title: "Relaxing / straightening services", sinhala: "හිසකෙස් කෙලින් කිරීම / relaxing" },
      { code: "HD-M12", title: "Colour hair", sinhala: "හිසකෙස් වර්ණ කිරීම" },
      { code: "HD-M13", title: "Promotion & selling hair care products & services", sinhala: "නිෂ්පාදන ප්‍රවර්ධන හා විකිණීම" },
      { code: "HD-M14", title: "Hairdressing salon management", sinhala: "සැලෝන් කළමනාකරණය" },
    ],
  },
];

export const ModulesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("bridal");

  return (
    <section className="py-24 bg-background">
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://wa.me/94754420805"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-rose-dark transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Order Your Notes Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};
