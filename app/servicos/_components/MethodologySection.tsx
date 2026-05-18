import { SlideIn } from "@/components/animations/SlideIn";

const steps = [
  {
    title: "Diagnóstico",
    description:
      "Entendemos o regime tributário, segmento, porte e particularidades da empresa para identificar potenciais oportunidades.",
  },
  {
    title: "Coleta documental",
    description:
      "Definimos e coletamos os documentos fiscais, contábeis e previdenciários necessários para a análise técnica.",
  },
  {
    title: "Revisão dos últimos 5 anos",
    description:
      "Analisamos o histórico fiscal dentro do prazo legal de recuperação.",
  },
  {
    title: "Cruzamento e validação",
    description:
      "Cruzamos informações entre escriturações, notas, eSocial e demais obrigações acessórias para validar a consistência dos dados.",
  },
  {
    title: "Apuração dos créditos",
    description:
      "Elaboramos memória de cálculo detalhada e documentamos cada competência com base técnica e auditável.",
  },
  {
    title: "Restituição ou compensação",
    description:
      "Conduzimos o processo junto à Receita Federal, com restituição em espécie ou compensação com tributos futuros.",
  },
];

export function MethodologySection() {
  return (
    <section className="relative overflow-hidden bg-[#05090c] py-16 text-white md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(242,196,15,0.10),_transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mx-auto mb-14 max-w-[760px] text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
            Nossa{" "}
            <span className="text-gold-gradient">metodologia</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-300 md:text-lg">
            Processo técnico, transparente e auditável, conduzido em seis etapas
            estruturadas para garantir segurança e previsibilidade do início ao
            fim.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ title, description }, index) => (
            <SlideIn
              key={title}
              from="bottom"
              delay={index * 300}
              duration={1200}
              distance={100}
              className="h-full"
            >
              <article className="relative h-full border border-[#f2c40f]/30 bg-white px-6 py-7 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f] hover:shadow-[0_8px_32px_rgba(242,196,15,0.18)] md:px-7 md:py-8">
                <h3 className="mt-1 text-lg font-bold uppercase tracking-tight text-[#12151b]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  {description}
                </p>
              </article>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}
