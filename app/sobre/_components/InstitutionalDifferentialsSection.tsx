import {
  HeadphonesIcon,
  ListChecks,
  Lock,
  MessageSquareText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface DifferentialItem {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const differentials: DifferentialItem[] = [
  {
    title: "Atendimento Especializado",
    description:
      "Cada cliente conta com um time dedicado que entende as particularidades do seu negócio.",
    icon: HeadphonesIcon,
  },
  {
    title: "Processo Estruturado",
    description:
      "Metodologia própria com etapas claras, prazos definidos e acompanhamento em tempo real.",
    icon: ListChecks,
  },
  {
    title: "Confidencialidade",
    description:
      "Sigilo absoluto em todas as operações, protegendo as informações dos nossos parceiros.",
    icon: Lock,
  },
  {
    title: "Transparência",
    description:
      "Relatórios detalhados e comunicação clara em cada fase do projeto.",
    icon: ShieldCheck,
  },
  {
    title: "Experiência no Mercado",
    description:
      "Anos de atuação e centenas de projetos bem-sucedidos em recuperação tributária.",
    icon: TrendingUp,
  },
  {
    title: "Comunicação Profissional",
    description:
      "Canais diretos, respostas ágeis e linguagem acessível para decisores e contadores.",
    icon: MessageSquareText,
  },
];

export function InstitutionalDifferentialsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Nossos Diferenciais
          </h2>
          <p className="mt-4 text-base text-[#3b3f47] md:text-lg">
            O que nos torna a escolha certa para a recuperação dos seus ativos.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="group border border-zinc-200 bg-[#fafafa] px-6 py-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/60 hover:shadow-md md:px-8 md:py-8"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0a0f16] text-[#f2c40f] transition-colors group-hover:bg-[#f2c40f] group-hover:text-[#0a0f16]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#12151b]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#3b3f47]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
