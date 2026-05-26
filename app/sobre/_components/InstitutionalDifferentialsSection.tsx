import {
  CalendarRange,
  HeadphonesIcon,
  ListChecks,
  Lock,
  MessageSquareText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
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
              className="group relative border border-zinc-200 bg-[#fafafa] px-6 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/60 hover:shadow-md md:px-8 md:py-8"
            >
              <Image
                src="/imagens/elementos/m2_selo.png"
                alt="Selo M2"
                width={88}
                height={88}
                className="pointer-events-none absolute right-0 top-0 h-[88px] w-[88px] object-contain"
              />
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#0a0f16] text-[#f2c40f] transition-colors group-hover:bg-[#f2c40f] group-hover:text-[#0a0f16]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#12151b]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#3b3f47]">
                {description}
              </p>
            </article>
          ))}
        </div>

        {/* Diferencial adicional com luz dourada intensa */}
        <div className="group relative mt-5">
          {/* Aura luminosa multi-camadas */}
          <div 
            className="absolute -inset-6 pointer-events-none opacity-60 group-hover:opacity-100 blur-3xl transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, #f2c40f 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, #ffd700 0%, transparent 55%)'
            }}
          ></div>
          <div 
            className="absolute -inset-4 pointer-events-none opacity-40 group-hover:opacity-80 blur-2xl transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at center, #f2c40f 0%, #ffb000 30%, transparent 70%)'
            }}
          ></div>
          <div 
            className="absolute -inset-2 pointer-events-none opacity-30 group-hover:opacity-60 blur-xl transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at center, #f2c40f 0%, transparent 60%)'
            }}
          ></div>
          
          <article className="relative flex flex-col items-center gap-6 border border-[#f2c40f]/20 bg-[#fafafa] px-6 py-7 text-center shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[#f2c40f]/60 hover:shadow-[0_20px_50px_-10px_rgba(242,196,15,0.35)] md:px-8 md:py-8">
            {/* Linha superior de acento que cresce no hover */}
            <span 
              className="absolute top-0 left-0 h-[3px] w-12 group-hover:w-full transition-all duration-500 ease-out"
              style={{
                background: 'linear-gradient(90deg, #f2c40f 0%, #ffd700 100%)'
              }}
            ></span>
            
            <Image
              src="/imagens/elementos/m2_selo.png"
              alt="Selo M2"
              width={88}
              height={88}
              className="pointer-events-none absolute right-0 top-0 h-[88px] w-[88px] object-contain"
            />
          <div className="flex-shrink-0">
            <div className="mx-auto mb-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#0a0f16] text-[#f2c40f] transition-all duration-500 group-hover:bg-[#f2c40f] group-hover:text-[#0a0f16] group-hover:shadow-[0_0_24px_rgba(242,196,15,0.6)] group-hover:scale-110">
              <CalendarRange className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black tracking-tight text-[#12151b] md:text-2xl">
              5 Anos de Acompanhamento Garantido
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-8 text-[#3b3f47] md:text-lg md:leading-8">
              Após a assinatura do contrato, a M2 permanece ao seu lado por{" "}
              <span className="font-bold text-[#12151b]">5 anos</span>,
              monitorando resultados, adaptando estratégias e assegurando que
              cada crédito recuperado continue gerando valor para o seu negócio.
            </p>
          </div>
          </article>
        </div>
      </div>
    </section>
  );
}
