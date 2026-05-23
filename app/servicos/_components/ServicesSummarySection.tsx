import { SlideIn } from "@/components/animations/SlideIn";

const services = [
  {
    title: "Contribuição Previdenciária Patronal",
    tag: "Lucro Real · Lucro Presumido",
    description:
      "Verbas indenizatórias indevidamente incluídas na base do INSS patronal nos últimos 5 anos.",
  },
  {
    title: "Exclusão do ICMS do PIS/COFINS",
    tag: "Lucro Real · Lucro Presumido",
    description:
      "Tese do STF (Tema 69): ICMS não compõe a base de cálculo do PIS e COFINS. Créditos retroativos disponíveis.",
  },
  {
    title: "PIS/COFINS — Despesas Essenciais",
    tag: "Lucro Real",
    description:
      "Aproveitamento de créditos sobre despesas diretamente ligadas à atividade operacional da empresa.",
  },
  {
    title: "Produtos Monofásicos",
    tag: "Simples Nacional",
    description:
      "Empresas que revendem alimentos, cosméticos, medicamentos e autopeças pagam PIS/COFINS em duplicidade.",
  },
  {
    title: "Laudos de Perda",
    tag: "Lucro Real · Setor alimentício",
    description:
      "Comprovação técnica de perdas naturais em processos de desossa, fracionamento e deterioração, permitindo dedução de IRPJ e CSLL.",
  },
  {
    title: "Evaporação de Combustíveis",
    tag: "Lucro Real · Postos",
    description:
      "Perdas de estoque por evaporação são dedutíveis para fins de IRPJ e CSLL.",
  },
];

const whatsappUrl = `https://wa.me/5588992156717?text=${encodeURIComponent(
  "Olá! Gostaria de conversar com um especialista."
)}`;

export function ServicesSummarySection() {
  return (
    <section id="servicos" className="bg-[#05090c] py-16 text-white md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mt-4 text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl">
            Nossos
            <span className="text-gold-gradient"> serviços</span>
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400 md:text-base">
            Soluções tributárias com base em análise técnica e conformidade legal.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <SlideIn
              key={service.title}
              from="bottom"
              delay={index * 300}
              duration={1200}
              distance={100}
              className="h-full"
            >
              <article className="h-full border border-white/10 border-t-2 border-t-[#f2c40f] bg-[#1a1a1a] p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/70">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2c40f]">
                  {service.tag}
                </p>
                <h3 className="text-xl font-black uppercase leading-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  {service.description}
                </p>
              </article>
            </SlideIn>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <p className="text-base font-semibold text-zinc-200">
            Não sabe qual serviço se aplica?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold-gradient inline-flex h-12 items-center justify-center px-6 text-sm font-black uppercase tracking-wide text-[#0a0f16] transition-all hover:brightness-105"
          >
            Falar com especialista
          </a>
        </div>
      </div>
    </section>
  );
}
