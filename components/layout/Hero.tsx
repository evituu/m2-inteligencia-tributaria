import { NavigationMenu } from "@/components/layout/navigation-menu";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[760px] items-center overflow-hidden bg-[#04070d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imagens/office/fachada_m2.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/55" />

      <NavigationMenu />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] px-5 pt-32 pb-16 md:px-8 md:pt-44 md:pb-24">
        <div className="max-w-[730px]">
          <span className="mb-8 block h-2 w-16 bg-[#f2c40f]" />

          <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            Recuperação de crédito com autoridade e precisão
          </h1>

          <p className="mt-8 max-w-[680px] text-base text-zinc-300 md:text-2xl">
            Soluções estratégicas de alta performance para escritórios de
            contabilidade transformarem ativos perdidos em liquidez imediata.
          </p>

          <button
            type="button"
            className="mt-10 inline-flex h-12 items-center justify-center bg-[#f2c40f] px-8 text-base font-black uppercase tracking-wide text-[#0a0f16] transition-colors hover:bg-[#ffd82f] md:h-20 md:px-12 md:text-4xl"
          >
            Diagnóstico gratuito
          </button>
        </div>
      </div>
    </section>
  );
}
