import { CheckCircle2 } from "lucide-react";

import { LeadQualificationForm } from "@/components/home/LeadQualificationForm";

const postSubmitSteps = [
  "Analisamos as informações e identificamos teses aplicáveis ao seu perfil.",
  "Entramos em contato em até 24h úteis para alinhar os próximos passos.",
  "Apresentamos o potencial estimado de recuperação, sem compromisso.",
];

export function LeadQualificationSection() {
  return (
    <section id="formulario" className="bg-[#0a0f16] py-16 text-white md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight md:text-5xl">
            Descubra quanto 
            <span className="text-gold-gradient"> sua empresa </span> pode recuperar
          </h2>
          <p className="mt-6 max-w-[680px] text-base leading-8 text-zinc-300 md:text-lg">
            Preencha o formulário. Nossa equipe realiza a análise prévia sem
            custo e entra em contato em até 24 horas úteis.
          </p>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <h3 className="text-lg font-bold text-white">
              O que acontece após o envio?
            </h3>
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
