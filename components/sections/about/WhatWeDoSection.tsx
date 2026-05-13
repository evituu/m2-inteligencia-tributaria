import { BadgeDollarSign, FileSearch, Handshake } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface ServiceItem {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const services: ServiceItem[] = [
  {
    title: "Recuperação de PIS e COFINS sobre produtos monofásicos",
    description:
      "Análise fiscal para identificar valores de PIS e COFINS pagos indevidamente sobre produtos sujeitos à tributação monofásica, possibilitando restituição com segurança.",
    icon: BadgeDollarSign,
  },
  {
    title: "Exclusão do ICMS da base do PIS e da COFINS",
    description:
      "Revisão tributária para apurar créditos decorrentes da exclusão do ICMS da base de cálculo do PIS e da COFINS, conforme entendimento consolidado pelo STF",
    icon: FileSearch,
  },
  {
    title: "Recuperação de créditos previdenciários",
    description:
      "Revisão da folha de pagamento para identificar contribuições previdenciárias recolhidas indevidamente ou a maior, permitindo compensações futuras.",
    icon: Handshake,
  },
];

export function WhatWeDoSection() {
  return (
    <section className="bg-[#f2c40f] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#0a0f16] md:text-5xl">
            O que fazemos
          </h2>
          <p className="mt-4 text-base text-[#0a0f16]/70 md:text-lg">
            Soluções integradas para a maximização dos seus resultados
            financeiros.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="border-l-4 border-[#f2c40f] bg-[#0a0f16] px-6 py-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 md:px-8 md:py-10"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f2c40f]/15 text-[#f2c40f]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
