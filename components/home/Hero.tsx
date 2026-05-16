import { NavigationMenu } from "@/components/layout/navigation-menu";

const analysisWhatsappUrl =
  "https://wa.me/5588992156717?text=Ol%C3%A1!%20Gostaria%20de%20uma%20an%C3%A1lise%20tribut%C3%A1ria%20gratuita.";

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
        <div className="max-w-[760px]">
          <span className="mb-5 inline-flex bg-[#c9a84c]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f2c40f]">
            Especialistas em Recuperação Tributária
          </span>

          <span className="mb-8 block h-2 w-16 bg-[#f2c40f]" />

          <h1 className="text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            Imposto pago a mais não é custo. É crédito a recuperar.
          </h1>

          <p className="mt-8 max-w-[720px] text-base text-zinc-300 md:text-2xl">
            A M2 analisa o histórico fiscal da sua empresa e recupera valores
            pagos indevidamente ao governo, com laudo técnico, segurança jurídica
            e sem custo antecipado.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={analysisWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-gradient inline-flex h-12 items-center justify-center px-8 text-sm font-black uppercase tracking-wide text-[#0a0f16] shadow-[0_6px_24px_rgba(246,222,149,0.28)] transition-all duration-300 ease-out hover:-translate-y-1 hover:brightness-105 md:h-16 md:px-10 md:text-xl"
            >
              Quero minha análise gratuita →
            </a>

            <a
              href="#como-funciona"
              className="inline-flex h-12 items-center justify-center border border-white/80 px-8 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f] hover:text-[#f2c40f] md:h-16 md:px-10 md:text-xl"
            >
              Como funciona ↓
            </a>
          </div>

          <p className="mt-3 text-xs text-zinc-300">
            Análise inicial gratuita · Honorários só sobre o que for recuperado
          </p>
        </div>
      </div>
    </section>
  );
}
