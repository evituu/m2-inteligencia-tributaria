import Link from "next/link";
import { Download } from "lucide-react";

export function BlogEbookBanner() {
  return (
    <section className="relative overflow-hidden bg-[#04070d] py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(242,196,15,0.14),_transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="grid items-center gap-10 border border-[#f2c40f]/25 bg-[#0a0f16]/80 p-8 md:grid-cols-[1fr_auto] md:p-12 lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f2c40f]">
              Material gratuito
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
              Manual Prático de{" "}
              <span className="text-gold-gradient">
                Auditoria e Revisão Fiscal
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              Baixe o e-book com checklist técnico, etapas de diagnóstico e
              boas práticas para conduzir revisões fiscais com segurança
              jurídica e rastreabilidade documental.
            </p>
          </div>
          <Link
            href="/#formulario"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 bg-gold-gradient px-8 text-sm font-black uppercase tracking-wide text-[#0a0f16] transition-all hover:brightness-105 md:px-10"
          >
            <Download className="h-5 w-5" />
            Baixar e-book
          </Link>
        </div>
      </div>
    </section>
  );
}
