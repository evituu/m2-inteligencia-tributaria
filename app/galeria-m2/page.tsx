import { HeroGaleria } from "./_components/hero-galeria";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { GalleryAlbumCard } from "./_components/GalleryAlbumCard";
import { getAllAlbums } from "@/data/gallery";
import { SlideIn } from "@/components/animations/SlideIn";
export const metadata = {
  title: "Galeria - M2 Inteligência Tributária",
  description: "Conheça os bastidores, nossa cultura e estrutura através da Galeria M2.",
};

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <NavigationMenu />
      <HeroGaleria />

      <section className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <SlideIn from="bottom" duration={900} distance={60}>
            <div className="mb-10 text-center">
              <h2 className="mt-3 text-4xl md:text-3xl font-extrabold text-gold-gradient">
                ÁLBUNS M2
              </h2>
              <p className="mt-3 text-sm md:text-base text-zinc-600">
                Selecione um álbum para explorar nossos momentos e bastidores.
              </p>
            </div>
          </SlideIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAllAlbums().map((album, index) => (
              <SlideIn
                key={album.slug}
                from="bottom"
                delay={index * 150}
                duration={900}
                distance={60}
                className="h-full"
              >
                <GalleryAlbumCard album={album} />              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}