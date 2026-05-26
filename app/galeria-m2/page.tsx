import Link from "next/link";
import { HeroGaleria } from "./_components/hero-galeria";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
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
                <Link
                  href={`/galeria-m2/${album.slug}`}
                  className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c40f] focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-200">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
                      style={{ backgroundImage: `url('${album.coverImage}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full bg-[#f2c40f] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0a0f16] opacity-0 transition-all duration-300 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100">
                        VER
                      </span>
                    </div>
                    <div className="absolute inset-x-6 bottom-5">
                      <h3 className="mt-1 text-xl font-semibold text-gold-gradient">
                        {album.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}