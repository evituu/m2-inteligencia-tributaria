import { HeroGaleria } from "./_components/hero-galeria";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";


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
          <div className="mb-10 text-center">
            <h2 className="mt-3 text-4xl md:text-3xl font-extrabold text-gold-gradient">
              ÁLBUNS M2
            </h2>
            <p className="mt-3 text-sm md:text-base text-zinc-600">
              Selecione um album para explorar nossos momentos e bastidores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Eventos e encontros",
                image: "/imagens/office/fachada_m2.webp",
              },
              {
                title: "Escritorio M2",
                image: "/imagens/office/m2_colaboradores_trabalhando.png",
              },
              {
                title: "Bastidores",
                image: "/imagens/office/m2_lideres_socios.png",
              },
            ].map((album) => (
              <div key={album.title} className="group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url('${album.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                  <div className="absolute inset-x-6 bottom-5">
                    <h3 className="mt-1 text-xl font-semibold text-gold-gradient">{album.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
