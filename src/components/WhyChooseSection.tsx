"use client";
import { motion } from "framer-motion";
import {
  FileCheck2,
  Languages,
  Clock4,
  HeartHandshake,
  PenTool,
  ShieldCheck,
} from "lucide-react";

const reasons = [
  {
    icon: FileCheck2,
    title: "Exam-Ready Notes",
    description:
      "Every module is written to match the NVQ Level 4 syllabus so you study exactly what matters.",
    color: "from-primary to-rose-dark",
  },
  {
    icon: PenTool,
    title: "Customized Projects",
    description:
      "We prepare personalised assignments and projects tailored to your unit requirements.",
    color: "from-purple to-primary",
  },
  {
    icon: Languages,
    title: "English & Sinhala",
    description:
      "Clear explanations in both languages so every student can follow along with ease.",
    color: "from-rose-medium to-primary",
  },
  {
    icon: Clock4,
    title: "Save Study Time",
    description:
      "Skip the hours of compiling notes — get organised, ready-to-use materials instantly.",
    color: "from-primary to-purple-dark",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    description:
      "Created by a qualified NVQ Level 4 professional and trusted by 500+ students.",
    color: "from-purple-dark to-primary",
  },
  {
    icon: HeartHandshake,
    title: "Friendly Support",
    description:
      "Quick help over WhatsApp whenever you need guidance with your order or content.",
    color: "from-primary to-rose-medium",
  },
];

export const WhyChooseSection = () => {
  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Thoughtfully prepared study materials and projects, built around what NVQ Level 4 students really need.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all overflow-hidden"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${reason.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <reason.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
