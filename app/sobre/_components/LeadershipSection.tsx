import Image from "next/image";
import { SlideIn } from "@/components/animations/SlideIn";

const leaders = [
  {
    name: "Veimar Barroso Gomides",
    role: "CEO e fundador da M2",
    description:
      "Atua no setor tributário há mais de 15 anos e é responsável pela direção estratégica da empresa, tomada de decisões e direcionamento da organização.",
  },
  {
    name: "Nuccia Carla",
    role: "Sócia e Diretora Executiva da M2",
    description:
      "Responsável pela condução estratégica e pela gestão institucional da empresa.",
  },
];

export function LeadershipSection() {
  return (
    <section className="bg-[#05090c] py-16 text-white md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="relative mx-auto mb-14 max-w-[680px]">
          <div
            className="rounded-lg p-1.5 shadow-[0_0_32px_rgba(217,173,85,0.25)] md:p-2"
            style={{
              background:
                "linear-gradient(135deg, #d9ad55 0%, #f6de95 42%, #e8c676 70%, #d7aa52 100%)",
            }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md md:rounded-lg">
              <Image
                src="/imagens/office/foto_veimar_m2.jpg"
                alt="Sócios da M2 Inteligência Tributária"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 680px"
              />
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
            Nossa 
            <span className="text-gold-gradient"> Liderança</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {leaders.map((leader, index) => (
            <SlideIn
              key={leader.name}
              from="bottom"
              delay={index * 170}
              duration={1000}
              distance={100}
            >
              <article className="border-l-4 border-[#f2c40f] bg-white/[0.04] px-6 py-7 transition-transform duration-300 hover:-translate-y-1 md:px-8 md:py-9">
                <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f2c40f]">
                  {leader.role}
                </p>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  {leader.description}
                </p>
              </article>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  );
}
