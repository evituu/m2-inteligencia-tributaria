import { AiOutlineWhatsApp } from "react-icons/ai";

export function WhatsAppCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a1f27] py-14 md:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center gap-6 px-5 text-center md:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/15 ring-2 ring-[#25D366]/50">
          <AiOutlineWhatsApp className="h-9 w-9 text-[#25D366]" />
        </div>

        <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
          Fale{" "}
          <span className="text-[#f2c40f]">diretamente</span>{" "}
          com a nossa{" "}
          <span className="text-[#f2c40f]">equipe</span>
        </h2>

        <p className="max-w-[600px] text-base leading-relaxed text-zinc-300 md:text-lg">
          Tire suas dúvidas,
          ou entenda como podemos ajudar a sua empresa de forma{" "}
          <span className="font-semibold text-white">rápida e sem burocracia.</span>
        </p>

        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-16 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#25D366] via-[#21bf5b] to-[#1ebe57] px-12 text-lg font-black uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-105 hover:from-[#1ebe57] hover:via-[#1da851] hover:to-[#179245] hover:shadow-[0_6px_32px_rgba(37,211,102,0.5)]"
        >
          <AiOutlineWhatsApp className="h-7 w-7" />
          Fale conosco
        </a>

      </div>
    </section>
  );
}
