import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
import { ServicesHeroSection } from "@/app/servicos/_components/ServicesHeroSection";
import { ServicesIntroSection } from "@/app/servicos/_components/ServicesIntroSection";
import { MethodologySection } from "@/app/servicos/_components/MethodologySection";
import { SegmentsSection } from "@/app/servicos/_components/SegmentsSection";
import { ComplianceSection } from "@/app/servicos/_components/ComplianceSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ServicesCtaSection } from "@/app/servicos/_components/ServicesCtaSection";
import { Footer } from "@/components/layout/Footer";
import { ServicesSummarySection } from "@/app/servicos/_components/ServicesSummarySection";

export const metadata: Metadata = {
  title: "Serviços de Recuperação Tributária",
  description:
    "Recuperação de PIS/COFINS sobre produtos monofásicos, INSS sobre folha, ICMS-ST e outros tributos pagos indevidamente. Compliance fiscal e holding patrimonial para empresas de todos os portes.",
  openGraph: {
    title: "Serviços de Recuperação Tributária — M2 Inteligência Tributária",
    description:
      "Recuperação de PIS/COFINS, INSS, ICMS-ST e outros créditos tributários. Atendemos empresas de todos os portes em todo o Brasil.",
    url: "/servicos",
    type: "website",
    images: [
      {
        url: "/imagens/office/fachada_m2.webp",
        width: 1200,
        height: 630,
        alt: "Serviços M2 Inteligência Tributária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serviços de Recuperação Tributária — M2",
    description:
      "Recuperação de PIS/COFINS, INSS, ICMS-ST e outros créditos tributários para sua empresa.",
    images: ["/imagens/office/fachada_m2.webp"],
  },
};

export default function ServicosPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "M2 Inteligência Tributária",
          description:
            "Serviços especializados em recuperação de créditos tributários, compliance fiscal e holding patrimonial.",
          url: "https://m2inteligenciatributaria.com.br/servicos",
          areaServed: "BR",
          serviceType: [
            "Recuperação de PIS/COFINS",
            "Recuperação de INSS sobre Folha",
            "Recuperação de ICMS-ST",
            "Compliance Fiscal",
            "Holding Patrimonial",
          ],
          provider: {
            "@type": "Organization",
            name: "M2 Inteligência Tributária",
            url: "https://m2inteligenciatributaria.com.br",
          },
        }}
      />
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
