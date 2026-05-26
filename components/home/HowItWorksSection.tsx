import { SlideIn } from "@/components/animations/SlideIn";

const steps = [
  {
    title: "Recebimento dos documentos",
    description:
      "O cliente envia os documentos, informações e arquivos fiscais necessários para iniciarmos a análise da empresa.",
  },
  {
    title: "Análise e revisão",
    description:
      "Nossa equipe realiza a conferência técnica dos dados fiscais, revisa as informações e identifica possíveis créditos tributários a recuperar.",
  },
  {
    title: "Contrato",
    description:
      "Após a validação das oportunidades encontradas, formalizamos a contratação com clareza sobre escopo, condições e honorários.",
  },
  {
    title: "Formalização dos pedidos",
    description:
      "Com tudo aprovado, preparamos e formalizamos os pedidos de recuperação ou compensação dos créditos junto aos órgãos competentes.",
  },
  {
    title: "Crédito recuperado",
    description:
      "Os valores recuperados podem ser restituídos em dinheiro ou utilizados para compensar tributos futuros da empresa.",
  },
  {
    title: "Acompanhamento",
    description:
      "Acompanhamos o andamento dos pedidos e mantemos o cliente informado até a conclusão do processo.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-[#0a0f16] py-16 text-white md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SlideIn
            from="left"
            duration={950}
            distance={80}
            overflowHidden={false}
          >
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl">
              Como
              <span className="text-gold-gradient"> recuperamos </span>
              seus créditos passo a passo
            </h2>
          </SlideIn>
        </div>

        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <SlideIn
              key={step.title}
              from="bottom"
              delay={index * 300}
              duration={1200}
              distance={100}
              className="h-full"
            >
              <article className="relative h-full border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/15">
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#f2c40f]/50 bg-[#0a0f16] text-2xl font-black text-[#f2c40f]">
                  {index + 1}
                </div>

                <h3 className="text-lg font-black uppercase text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {step.description}
                </p>
              </article>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}