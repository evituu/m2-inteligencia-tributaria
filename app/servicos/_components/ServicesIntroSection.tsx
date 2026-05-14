import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Falhas de classificação fiscal e tributária",
  "Mudanças na legislação não absorvidas pela contabilidade",
  "Ausência de segregação fiscal entre tributos e regimes",
  "Falta de revisão periódica das obrigações acessórias",
];

export function ServicesIntroSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] items-start gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight text-[#12151b] md:text-5xl">
            Muitas empresas pagam mais tributos do que deveriam
          </h2>
          <p className="mt-6 max-w-[560px] text-base leading-8 text-[#3b3f47] md:text-lg">
            Alterações constantes na legislação, complexidade do sistema fiscal
            brasileiro e falta de revisão periódica fazem com que parte
            relevante das empresas recolha tributos a maior sem perceber.
          </p>
          <p className="mt-4 max-w-[560px] text-base leading-8 text-[#3b3f47] md:text-lg">
            A <span className="font-semibold text-[#12151b]">M2 Inteligência Tributária</span>{" "}
            atua com análise técnica, segurança documental e conformidade
            fiscal para identificar e recuperar esses valores de forma legítima
            e auditável.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-[#fafafa] p-6 shadow-sm md:p-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">
            Principais causas de tributos recolhidos a maior
          </h3>
          <ul className="mt-5 space-y-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#f2c40f]" />
                <span className="text-sm leading-7 text-[#3b3f47] md:text-base">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
