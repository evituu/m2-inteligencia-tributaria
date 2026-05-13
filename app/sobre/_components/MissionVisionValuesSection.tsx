import { Eye } from "lucide-react";
import { BsFillRocketTakeoffFill, BsLightbulbFill } from "react-icons/bs";
import type { ComponentType } from "react";

interface MvvItem {
  title: string;
  description?: string;
  bullets?: string[];
  icon: ComponentType<{ className?: string }>;
}

const items: MvvItem[] = [
  {
    title: "Missão",
    description:
      "Recuperar ativos tributários com excelência técnica e ética, fortalecendo a saúde financeira das empresas e seus ecossistemas contábeis.",
    icon: BsFillRocketTakeoffFill,
  },
  {
    title: "Visão",
    description:
      "Ser a principal referência nacional em inteligência tributária, reconhecida pela inovação, transparência e resultados consistentes.",
    icon: Eye,
  },
  {
    title: "Valores",
    bullets: ["Precisão", "Transparência", "Recuperação", "Saúde Financeira"],
    icon: BsLightbulbFill,
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
          {items.map(({ title, description, bullets, icon: Icon }) => (
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

              {description ? (
                <p className="mt-3 text-sm leading-7 text-[#3b3f47]">
                  {description}
                </p>
              ) : null}

              {bullets ? (
                <ul className="mt-3 space-y-2 text-sm leading-7 text-[#3b3f47]">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#f2c40f]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
