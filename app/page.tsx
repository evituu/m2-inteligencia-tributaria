import { Hero } from "@/components/home/Hero";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { NumbersSection } from "@/components/home/NumbersSection";
import { LeadQualificationSection } from "@/components/home/LeadQualificationSection";
import { WhatsAppCtaSection } from "@/components/home/WhatsAppCtaSection";
import { Footer } from "@/components/layout/Footer";
import { FaqSection } from "@/components/home/FaqSection";

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
