import { AiOutlineWhatsApp } from "react-icons/ai";

export function WhatsAppCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a1f27] py-14 md:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-6 px-5 text-center md:px-8">
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
          Prefere conversar antes de preencher formulário?
        </h2>

        <p className="max-w-[650px] text-base leading-relaxed text-zinc-300 md:text-lg">
          Nossa equipe está disponível de segunda a sexta, das 8h às 12h e das
          14h às 18h. Resposta rápida, sem burocracia.
        </p>

        <a
          href="https://wa.me/5588992156717?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20recupera%C3%A7%C3%A3o%20tribut%C3%A1ria%20para%20minha%20empresa."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-16 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#25D366] via-[#21bf5b] to-[#1ebe57] px-12 text-lg font-black uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-105 hover:from-[#1ebe57] hover:via-[#1da851] hover:to-[#179245] hover:shadow-[0_6px_32px_rgba(37,211,102,0.5)]"
        >
          <AiOutlineWhatsApp className="h-7 w-7" />
          Fale conosco
        </a>

        <p className="text-sm font-semibold text-zinc-400">
          Seg-Sex · 8h às 12h e 14h às 18h
        </p>
      </div>
    </section>
  );
}
