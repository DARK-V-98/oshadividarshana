import { HeroSection } from "@/components/HeroSection";
import { MarqueeBar } from "@/components/MarqueeBar";
import { PromoSection } from "@/components/PromoSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { PrintBindSection } from "@/components/PrintBindSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { AboutSection } from "@/components/AboutSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { NailsSection } from "@/components/NailsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <PromoSection />
      <CategoriesSection />
      <NailsSection />
      <PrintBindSection />
      <WhyChooseSection />
      <AboutSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
