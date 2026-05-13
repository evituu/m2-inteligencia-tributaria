import { Hero } from "@/components/layout/Hero";
import { ExpertiseSection } from "@/components/layout/ExpertiseSection";
import { NumbersSection } from "@/components/layout/NumbersSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <ExpertiseSection />
      <NumbersSection />
      <Footer />
    </>
  );
}
