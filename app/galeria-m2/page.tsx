export const dynamic = "force-dynamic";

import { HeroGaleria } from "./_components/hero-galeria";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { GalleryAlbumCard } from "./_components/GalleryAlbumCard";
import { getAllPublicAlbums } from "./_lib/gallery";
import { SlideIn } from "@/components/animations/SlideIn";

export const metadata = {
  title: "Galeria - M2 Inteligência Tributária",
  description: "Conheça os bastidores, nossa cultura e estrutura através da Galeria M2.",
};

export default async function GaleriaPage() {
  const albums = await getAllPublicAlbums();

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

          {albums.length === 0 ? (
            <p className="mt-8 text-center text-zinc-500">
              Nenhum álbum publicado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <SlideIn
                  key={album.slug}
                  from="bottom"
                  delay={index * 150}
                  duration={900}
                  distance={60}
                  className="h-full"
                >
                  <GalleryAlbumCard album={album} />
                </SlideIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
