import {
  BadgeDollarSign,
  Beef,
  ClipboardList,
  Droplets,
  FileSearch,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  indicatedFor: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const services: ServiceItem[] = [
  {
    slug: "pis-cofins-monofasicos",
    title: "Recuperação de PIS e COFINS sobre produtos monofásicos",
    description:
      "Identificação de valores pagos indevidamente sobre produtos sujeitos à tributação monofásica, com restituição segura e documentada.",
    indicatedFor:
      "Postos de combustíveis, farmácias, perfumarias, autopeças e revendas de pneus.",
    icon: BadgeDollarSign,
  },
  {
    slug: "exclusao-icms-pis-cofins",
    title: "Exclusão do ICMS da base do PIS e da COFINS",
    description:
      "Revisão tributária para apurar créditos decorrentes da exclusão do ICMS da base de cálculo, conforme entendimento consolidado pelo STF.",
    indicatedFor:
      "Empresas do regime de Lucro Real ou Presumido que recolhem PIS e COFINS sobre receita bruta.",
    icon: FileSearch,
  },
  {
    slug: "creditos-previdenciarios",
    title: "Recuperação de créditos previdenciários",
    description:
      "Revisão da folha de pagamento para identificar contribuições previdenciárias recolhidas a maior, permitindo compensação ou restituição.",
    indicatedFor:
      "Empresas com folha de pagamento relevante e múltiplas verbas indenizatórias.",
    icon: ShieldCheck,
  },
  {
    slug: "irpj-csll-evaporacao",
    title: "Dedução de IRPJ e CSLL por perdas com evaporação",
    description:
      "Apuração técnica das perdas operacionais por evaporação, viabilizando dedução legítima da base do IRPJ e da CSLL.",
    indicatedFor:
      "Postos de combustíveis e revendas de gás GLP com perdas operacionais documentadas.",
    icon: Droplets,
  },
  {
    slug: "laudo-perdas-alimenticio",
    title: "Laudo técnico de perdas no setor alimentício",
    description:
      "Elaboração de laudo técnico para reconhecimento contábil e fiscal das perdas inerentes ao setor, com efeito tributário direto.",
    indicatedFor:
      "Açougues, frigoríficos, supermercados, bares, restaurantes e indústrias de alimentos.",
    icon: Beef,
  },
  {
    slug: "diagnostico-tributario",
    title: "Diagnóstico tributário completo",
    description:
      "Análise integrada dos últimos cinco anos da empresa para mapear oportunidades de recuperação, restituição e compensação.",
    indicatedFor:
      "Empresas que nunca passaram por uma revisão fiscal estruturada ou mudaram de regime tributário recentemente.",
    icon: ClipboardList,
  },
];

export function ServicesGridSection() {
  return (
    <section id="grid-servicos" className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Nossos serviços
          </h2>
          <p className="mt-4 max-w-[640px] text-base text-[#3b3f47] md:mx-auto md:text-lg">
            Soluções tributárias e previdenciárias com base em análise técnica e
            conformidade legal.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, title, description, indicatedFor, icon: Icon }) => (
            <article
              key={slug}
              className="flex h-full flex-col border-t-4 border-[#f2c40f] bg-white px-6 py-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:px-7 md:py-8"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c40f]/15 text-[#c9a227]">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-[#12151b]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#3b3f47]">
                {description}
              </p>

              <div className="mt-5 rounded-md bg-[#fafafa] px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9a227]">
                  Indicado para
                </p>
                <p className="mt-1 text-xs leading-5 text-[#3b3f47]">
                  {indicatedFor}
                </p>
              </div>

              <Link
                href={`#${slug}`}
                className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-[#f2c40f] pb-0.5 text-sm font-bold uppercase tracking-wide text-[#12151b] transition-colors hover:text-[#c9a227]"
              >
                Saiba mais
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
