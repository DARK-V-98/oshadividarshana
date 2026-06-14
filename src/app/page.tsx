import { HeroSection } from "@/components/HeroSection";
import { MarqueeBar } from "@/components/MarqueeBar";
import { PromoSection } from "@/components/PromoSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { AboutSection } from "@/components/AboutSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <PromoSection />
      <CategoriesSection />
      <WhyChooseSection />
      <AboutSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
