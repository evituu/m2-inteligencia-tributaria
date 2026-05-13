import { NavigationMenu } from "@/components/layout/navigation-menu";

export function AboutHeroSection() {
  return (
    <section className="relative isolate flex min-h-[480px] items-center overflow-hidden bg-[#04070d] text-white md:min-h-[520px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imagens/office/fachada_m2.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60" />

      <NavigationMenu />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] px-5 pt-32 pb-16 md:px-8 md:pt-40 md:pb-20">
        <div className="max-w-[700px]">
          <span className="mb-6 block h-1.5 w-14 bg-[#f2c40f]" />
          <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Sobre a M2 Inteligência Tributária
          </h1>
          <p className="mt-6 max-w-[600px] text-base leading-relaxed text-zinc-300 md:text-lg">
            Somos especialistas em recuperação de crédito tributário com foco
            exclusivo no ecossistema contábil. Atuamos com rigor técnico,
            inteligência jurídica e tecnologia para transformar ativos perdidos
            em resultados concretos.
          </p>
        </div>
      </div>
    </section>
  );
}
