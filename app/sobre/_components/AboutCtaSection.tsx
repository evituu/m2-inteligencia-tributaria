import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";

export function AboutCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#05090c] py-16 text-white md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(242,196,15,0.10),_transparent_50%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-[780px] px-5 text-center md:px-8">
        <span className="mx-auto mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
        <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
          Vamos conversar sobre o 
          <span className="text-gold-gradient"> futuro da sua empresa?</span> 
        </h2>
        <p className="mt-5 text-base leading-relaxed text-zinc-300 md:text-lg">
          Entre em contato e descubra como podemos recuperar créditos e
          fortalecer o caixa do seu negócio com segurança e eficiência.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-3 bg-[#25D366] px-8 text-base font-black uppercase tracking-wide text-white transition-colors hover:bg-[#1ebe57]"
          >
            <AiOutlineWhatsApp className="h-6 w-6" />
            Fale pelo WhatsApp
          </a>
          <Link
            href="#"
            className="inline-flex h-14 items-center justify-center border-2 border-zinc-500 px-8 text-base font-bold uppercase tracking-wide text-zinc-200 transition-colors hover:border-[#f2c40f] hover:text-[#f2c40f]"
          >
            Conheça nossos serviços
          </Link>
        </div>
      </div>
    </section>
  );
}
