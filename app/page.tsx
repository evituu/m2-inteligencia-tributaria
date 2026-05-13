import { Hero } from "@/components/layout/Hero";
import { ExpertiseSection } from "@/components/sections/home/ExpertiseSection";
import { NumbersSection } from "@/components/layout/NumbersSection";
import { LeadQualificationSection } from "@/components/sections/home/LeadQualificationSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <ExpertiseSection />
      <NumbersSection />
      <LeadQualificationSection />
      <Footer />
    </>
  );
}
