import { ServicesHeroSection } from "@/app/servicos/_components/ServicesHeroSection";
import { ServicesIntroSection } from "@/app/servicos/_components/ServicesIntroSection";
import { MethodologySection } from "@/app/servicos/_components/MethodologySection";
import { SegmentsSection } from "@/app/servicos/_components/SegmentsSection";
import { ComplianceSection } from "@/app/servicos/_components/ComplianceSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ServicesCtaSection } from "@/app/servicos/_components/ServicesCtaSection";
import { Footer } from "@/components/layout/Footer";
import { ServicesSummarySection } from "@/app/servicos/_components/ServicesSummarySection";

export default function ServicosPage() {
  return (
    <>
      <ServicesHeroSection />
      <ServicesIntroSection />
      {/* <ServicesGridSection /> */}
      <ServicesSummarySection />
      <MethodologySection />
      <SegmentsSection />
      <ComplianceSection />
      <FaqSection />
      <ServicesCtaSection />
      <Footer />
    </>
  );
}
