export const dynamic = "force-dynamic";

import { Hero } from "@/components/home/Hero";
import { LatestInsightsTicker } from "@/components/home/LatestInsightsTicker";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { NumbersSection } from "@/components/home/NumbersSection";
import { ServicesSummarySection } from "@/app/servicos/_components/ServicesSummarySection";
import { LeadQualificationSection } from "@/components/home/LeadQualificationSection";
import { WhatsAppCtaSection } from "@/components/home/WhatsAppCtaSection";
import { Footer } from "@/components/layout/Footer";
import { FaqSection } from "@/components/home/FaqSection";
import { WhatsAppFab } from "@/components/home/WhatsAppFab";

export default function Home() {
  return (
    <>
      <Hero />
      <LatestInsightsTicker />
      <ExpertiseSection />
      <NumbersSection />
      <HowItWorksSection />
      <ServicesSummarySection />
      <LeadQualificationSection />
      <FaqSection />
      <WhatsAppCtaSection />
      <Footer />
      <WhatsAppFab />
    </>
  );
}
