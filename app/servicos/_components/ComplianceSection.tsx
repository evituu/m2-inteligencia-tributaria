import {
  Calculator,
  FileCheck2,
  FileSignature,
  Lock,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { SlideIn } from "@/components/animations/SlideIn";

interface ComplianceItem {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const items: ComplianceItem[] = [
  {
    title: "Base documental",
    description:
      "Toda operação parte de documentos fiscais oficiais, com integridade verificável.",
    icon: ScrollText,
  },
  {
    title: "Análise técnica",
    description:
      "Profissionais especializados conduzem cada etapa com critério técnico e jurídico.",
    icon: ShieldCheck,
  },
  {
    title: "Memória de cálculo",
    description:
      "Cada crédito apurado é acompanhado de memória de cálculo detalhada por competência.",
    icon: Calculator,
  },
  {
    title: "Formalização contratual",
    description:
      "Atuação formalizada via contrato, com escopo, prazos e responsabilidades claras.",
    icon: FileSignature,
  },
  {
    title: "Confidencialidade",
    description:
      "Sigilo absoluto sobre todas as informações compartilhadas durante o processo.",
    icon: Lock,
  },
  {
    title: "Conformidade legal",
    description:
      "Compensação ou restituição realizada estritamente conforme a legislação vigente.",
    icon: FileCheck2,
  },
];

export function ComplianceSection() {
  return (
    <section className="bg-[#fafafa] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 max-w-[760px]">
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Segurança, conformidade e responsabilidade fiscal
          </h2>
          <p className="mt-5 text-base leading-7 text-[#3b3f47] md:text-lg">
            Conduzimos cada projeto com critérios técnicos, segurança jurídica
            e transparência. O resultado é entregue de forma auditável e em
            total conformidade com a legislação.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, description, icon: Icon }, index) => (
            <SlideIn
              key={title}
              from="bottom"
              delay={index * 300}
              duration={1200}
              distance={100}
              className="h-full"
            >
              <article
              className="h-full border border-zinc-200 bg-white px-6 py-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/60 hover:shadow-md md:px-7 md:py-8"
            >
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0a0f16] text-[#f2c40f]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg text-center font-bold text-[#12151b]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#3b3f47]">
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
