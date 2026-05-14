import Link from "next/link";
import { AiOutlineWhatsApp } from "react-icons/ai";

export function ServicesCtaSection() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-[#05090c] py-16 text-white md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(242,196,15,0.12),_transparent_50%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-[860px] px-5 text-center md:px-8">
        <span className="mx-auto mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
          Quer saber se sua empresa possui{" "}
          <span className="text-[#f2c40f]">créditos a recuperar?</span>
        </h2>
        <p className="mt-6 text-base leading-relaxed text-zinc-300 md:text-lg">
          Solicite uma análise inicial e entenda quais oportunidades podem
          existir a partir do regime tributário, segmento e documentos fiscais
          da sua empresa.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/#formulario"
            className="inline-flex h-14 items-center justify-center bg-[#f2c40f] px-8 text-base font-black uppercase tracking-wide text-[#0a0f16] transition-colors hover:bg-[#ffd82f]"
          >
            Solicitar análise inicial
          </Link>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#25D366] via-[#21bf5b] to-[#1ebe57] px-8 text-base font-black uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-[1.03] hover:from-[#1ebe57] hover:via-[#1da851] hover:to-[#179245] hover:shadow-[0_6px_32px_rgba(37,211,102,0.5)]"
          >
            <AiOutlineWhatsApp className="h-6 w-6" />
            Falar pelo WhatsApp
          </a>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          Análise inicial gratuita e sem compromisso.
        </p>
      </div>
    </section>
  );
}
