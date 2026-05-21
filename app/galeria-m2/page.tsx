import { HeroGaleria } from "./_components/hero-galeria";

export const metadata = {
  title: "Galeria - M2 Inteligência Tributária",
  description: "Conheça os bastidores, nossa cultura e estrutura através da Galeria M2.",
};

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <HeroGaleria />
      {/* Aqui entrará o restante do grid de imagens no futuro */}
    </main>
  );
}
