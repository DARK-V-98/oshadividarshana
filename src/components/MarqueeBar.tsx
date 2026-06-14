"use client";
import { Sparkles } from "lucide-react";

const items = [
  "NVQ Level 4 Notes",
  "Customized Projects",
  "Bridal Dresser",
  "Beauty Culture",
  "Hair Dressing",
  "English & Sinhala",
  "Assignments & Samples",
  "Module-by-Module",
];

export const MarqueeBar = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-purple to-primary py-3 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((text, i) => (
          <div key={i} className="flex items-center text-white/95 font-medium whitespace-nowrap">
            <span className="px-6 text-sm md:text-base">{text}</span>
            <Sparkles className="w-4 h-4 text-white/70" />
          </div>
        ))}
      </div>
    </div>
  );
};
