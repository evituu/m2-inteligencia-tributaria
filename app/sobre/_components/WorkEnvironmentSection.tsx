import Image from "next/image";

export function WorkEnvironmentSection() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="relative aspect-[16/8] w-full overflow-hidden shadow-lg md:aspect-[16/7]">
          <Image
            src="/imagens/office/m2_colaboradores_trabalhando.png"
            alt="Equipe M2 Inteligência Tributária trabalhando em reunião"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>
      </div>
    </section>
  );
}
