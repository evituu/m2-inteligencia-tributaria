const steps = [
  {
    title: "Análise gratuita",
    description:
      "Você nos envia as informações da empresa. Identificamos se há créditos a recuperar e o potencial estimado, sem custo.",
  },
  {
    title: "Levantamento técnico",
    description:
      "Com os documentos em mãos, apuramos os valores, períodos elegíveis e a legislação aplicável a cada caso.",
  },
  {
    title: "Protocolo na Receita Federal",
    description:
      "Formalizamos o pedido com toda a documentação técnica e jurídica exigida, com laudo assinado por responsável técnico.",
  },
  {
    title: "Crédito recuperado",
    description:
      "Os valores são restituídos em dinheiro ou usados para compensar tributos futuros. Você paga nossos honorários apenas sobre o que for efetivamente recuperado.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-[#0a0f16] py-16 text-white md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mt-4 text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl">
            Como 
            <span className="text-gold-gradient"> recuperamos </span>
            os seus 
            <span className="text-gold-gradient"> créditos </span>
          </h2>
          <p className="mt-4 text-base text-zinc-400 md:text-lg">
            Transparente do início ao fim. Você acompanha cada etapa.
          </p>
        </div>

        <div className="relative grid gap-5 lg:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#f2c40f]/35 lg:block" />
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="relative border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/15"
            >
              <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#f2c40f]/50 bg-[#0a0f16] text-2xl font-black text-[#f2c40f]">
                {index + 1}
              </div>
              <h3 className="text-lg font-black uppercase text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
