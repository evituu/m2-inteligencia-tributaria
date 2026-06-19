import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
import { AboutHeroSection } from "@/app/sobre/_components/AboutHeroSection";
import { CompanyStorySection } from "@/app/sobre/_components/CompanyStorySection";
import { WorkEnvironmentSection } from "@/app/sobre/_components/WorkEnvironmentSection";
import { WhatWeDoSection } from "@/app/sobre/_components/WhatWeDoSection";
import { MissionVisionValuesSection } from "@/app/sobre/_components/MissionVisionValuesSection";
import { LeadershipSection } from "@/app/sobre/_components/LeadershipSection";
import { InstitutionalDifferentialsSection } from "@/app/sobre/_components/InstitutionalDifferentialsSection";
import { AboutCtaSection } from "@/app/sobre/_components/AboutCtaSection";
import { Footer } from "@/components/layout/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br";

export const metadata: Metadata = {
  title: "Sobre a M2",
  description:
    "Conheça a M2 Inteligência Tributária: nossa história, liderança, missão e diferenciais. Mais de 15 anos atuando em recuperação de créditos tributários em todo o Brasil.",
  openGraph: {
    title: "Sobre a M2 Inteligência Tributária",
    description:
      "Conheça a M2 Inteligência Tributária: nossa história, liderança, missão e diferenciais. Mais de 15 anos atuando em recuperação de créditos tributários em todo o Brasil.",
    url: "/sobre",
    type: "website",
    images: [
      {
        url: "/imagens/office/fachada_m2.webp",
        width: 1200,
        height: 630,
        alt: "Equipe M2 Inteligência Tributária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre a M2 Inteligência Tributária",
    description:
      "Conheça a M2 Inteligência Tributária: nossa história, liderança, missão e diferenciais.",
    images: ["/imagens/office/fachada_m2.webp"],
  },
};

export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Sobre a M2 Inteligência Tributária",
          description:
            "Especialistas em recuperação de créditos tributários com mais de 15 anos de experiência, atuando em todo o Brasil.",
          url: `${BASE_URL}/sobre`,
          publisher: {
            "@type": "Organization",
            name: "M2 Inteligência Tributária",
            url: BASE_URL,
          },
        }}
      />
      <AboutHeroSection />
      <CompanyStorySection />
      <WorkEnvironmentSection />
      <WhatWeDoSection />
      <MissionVisionValuesSection />
      <LeadershipSection />
      <InstitutionalDifferentialsSection />
      <AboutCtaSection />
      <Footer />
    </>
  );
}
