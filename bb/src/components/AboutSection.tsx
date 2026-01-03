import { motion } from "framer-motion";
import { CheckCircle2, Award, Heart, Clock, BookOpen, Users } from "lucide-react";

const benefits = [
  "Complete NVQ Level 4 theory notes",
  "Bridal & Beauty practical guidelines",
  "Assignments & sample answers",
  "Beginner-friendly study layouts",
  "Clear, well-organised lessons",
  "English & Sinhala explanations",
];

const features = [
  { icon: Clock, label: "Save valuable study time" },
  { icon: BookOpen, label: "Learn faster & efficiently" },
  { icon: Award, label: "Prepare with confidence" },
  { icon: Users, label: "Join 500+ successful students" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About the Creator
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              M.K.D Oshadi Vidarshana{" "}
              <span className="text-gradient">Perera</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Welcome! I'm a qualified Bridal Dresser (NVQ Level 4). This collection 
              of notes was specially created for students studying for the NVQ Level 4 
              in Bridal & Beauty. Every module is carefully crafted to help you 
              succeed in your examinations and practical assessments.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-4">
                What You Get
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.a
              href="https://wa.me/94754420805"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-rose-dark transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart className="w-5 h-5" />
              Contact Me
            </motion.a>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-gold/10 rounded-3xl blur-3xl" />
            
            <div className="relative grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">{feature.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-8 -right-4 bg-card border border-primary/20 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-rose-dark flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-playfair text-2xl font-bold text-foreground">NVQ L4</p>
                  <p className="text-xs text-muted-foreground">Certified</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
