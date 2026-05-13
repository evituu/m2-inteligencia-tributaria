import { Eye, Heart, Target } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface MvvItem {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const items: MvvItem[] = [
  {
    title: "Missão",
    description:
      "Recuperar ativos tributários com excelência técnica e ética, fortalecendo a saúde financeira das empresas e seus ecossistemas contábeis.",
    icon: Target,
  },
  {
    title: "Visão",
    description:
      "Ser a principal referência nacional em inteligência tributária, reconhecida pela inovação, transparência e resultados consistentes.",
    icon: Eye,
  },
  {
    title: "Valores",
    description:
      "Ética, transparência, rigor técnico, compromisso com o cliente, inovação contínua e responsabilidade social.",
    icon: Heart,
  },
];

export function MissionVisionValuesSection() {
  return (
    <section className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Missão, Visão e Valores
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="border-t-4 border-[#f2c40f] bg-white px-6 py-8 shadow-md transition-transform duration-300 hover:-translate-y-1 md:px-8 md:py-10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c40f]/15 text-[#f2c40f]">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[#12151b]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#3b3f47]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
