import { CheckCircle2, Lock } from "lucide-react";

import { LeadQualificationForm } from "@/components/forms/LeadQualificationForm";

const postSubmitSteps = [
  "Analisamos as informações enviadas.",
  "Entramos em contato para entender melhor sua necessidade.",
  "Indicamos o caminho mais adequado para o seu caso.",
];

export function LeadQualificationSection() {
  return (
    <section className="bg-[#0a0f16] py-16 text-white md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl">
            Solicite uma análise inicial
          </h2>
          <p className="mt-6 max-w-[680px] text-base leading-8 text-zinc-300 md:text-lg">
            Preencha o formulário para que nossa equipe entenda o cenário da sua
            empresa e indique o melhor caminho para iniciar o atendimento.
          </p>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <h3 className="text-lg font-bold text-white">O que acontece após o envio?</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300 md:text-base">
              {postSubmitSteps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#f2c40f]" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <LeadQualificationForm />
      </div>
    </section>
  );
}
