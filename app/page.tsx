export const dynamic = "force-dynamic";

import { JsonLd } from "@/components/shared/JsonLd";
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "M2 Inteligência Tributária",
          url: "https://m2inteligenciatributaria.com.br",
          logo: "https://m2inteligenciatributaria.com.br/imagens/logo/LOGO_M2.png",
          telephone: "+5588992156717",
          email: "m2inteligenciadptovendas@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Ana Saraiva de Menezes, 938",
            addressLocality: "Juazeiro do Norte",
            addressRegion: "CE",
            postalCode: "63046-515",
            addressCountry: "BR",
          },
          sameAs: [
            "https://www.instagram.com/m2inteligenciatributaria",
            "https://www.linkedin.com/company/m2-intelig%C3%AAnciatribut%C3%A1ria",
            "https://www.youtube.com/@M2Inteligenciatributaria",
          ],
        }}
      />
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
