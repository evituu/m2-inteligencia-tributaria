import { AboutHeroSection } from "@/components/sections/about/AboutHeroSection";
import { CompanyStorySection } from "@/app/sobre/_components/CompanyStorySection";
import { WorkEnvironmentSection } from "@/components/sections/about/WorkEnvironmentSection";
import { WhatWeDoSection } from "@/components/sections/about/WhatWeDoSection";
import { MissionVisionValuesSection } from "@/app/sobre/_components/MissionVisionValuesSection";
import { LeadershipSection } from "@/app/sobre/_components/LeadershipSection";
import { InstitutionalDifferentialsSection } from "@/app/sobre/_components/InstitutionalDifferentialsSection";
import { AboutCtaSection } from "@/app/sobre/_components/AboutCtaSection";
import { Footer } from "@/components/layout/Footer";

export default function SobrePage() {
  return (
    <>
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
