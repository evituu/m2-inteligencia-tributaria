import Link from "next/link";
import { NavigationMenu } from "@/components/layout/navigation-menu";

export function ServicesHeroSection() {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#04070d] text-white md:min-h-[640px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imagens/office/fachada_m2.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />

      <NavigationMenu />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] px-5 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <div className="max-w-[760px]">
          <span className="mb-6 block h-1.5 w-14 bg-[#f2c40f]" />
          <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Soluções tributárias para recuperar créditos e reduzir pagamentos
            indevidos
          </h1>
          <p className="mt-7 max-w-[680px] text-base leading-relaxed text-zinc-300 md:text-lg">
            A M2 Inteligência Tributária realiza revisões fiscais,
            previdenciárias e documentais para identificar oportunidades
            legítimas de recuperação, restituição e compensação de créditos.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#cta-final"
              className="inline-flex h-14 items-center justify-center bg-[#f2c40f] px-8 text-base font-black uppercase tracking-wide text-[#0a0f16] transition-colors hover:bg-[#ffd82f]"
            >
              Solicitar análise inicial
            </Link>
            <Link
              href="#grid-servicos"
              className="inline-flex h-14 items-center justify-center border-2 border-zinc-500 px-8 text-base font-bold uppercase tracking-wide text-zinc-200 transition-colors hover:border-[#f2c40f] hover:text-[#f2c40f]"
            >
              Conhecer serviços
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
