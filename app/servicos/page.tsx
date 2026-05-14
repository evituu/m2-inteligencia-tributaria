import { ServicesHeroSection } from "@/app/servicos/_components/ServicesHeroSection";
import { ServicesIntroSection } from "@/app/servicos/_components/ServicesIntroSection";
import { ServicesGridSection } from "@/app/servicos/_components/ServicesGridSection";
import { ServiceDetailsSection } from "@/app/servicos/_components/ServiceDetailsSection";
import { MethodologySection } from "@/app/servicos/_components/MethodologySection";
import { SegmentsSection } from "@/app/servicos/_components/SegmentsSection";
import { ComplianceSection } from "@/app/servicos/_components/ComplianceSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ServicesCtaSection } from "@/app/servicos/_components/ServicesCtaSection";
import { Footer } from "@/components/layout/Footer";

export default function ServicosPage() {
  return (
    <>
      <ServicesHeroSection />
      <ServicesIntroSection />
      <ServicesGridSection />
      <MethodologySection />
      <SegmentsSection />
      <ComplianceSection />
      <FaqSection />
      <ServicesCtaSection />
      <Footer />
    </>
  );
}
