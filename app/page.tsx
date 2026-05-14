import { Hero } from "@/components/sections/home/Hero";
import { ExpertiseSection } from "@/components/sections/home/ExpertiseSection";
import { NumbersSection } from "@/components/sections/home/NumbersSection";
import { LeadQualificationSection } from "@/components/sections/home/LeadQualificationSection";
import { WhatsAppCtaSection } from "@/components/sections/home/WhatsAppCtaSection";
import { Footer } from "@/components/layout/Footer";
import { FaqSection } from "@/components/sections/home/FaqSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ExpertiseSection />
      <NumbersSection />
      <LeadQualificationSection />
      <FaqSection />
      <WhatsAppCtaSection />
      <Footer />
    </>
  );
}
