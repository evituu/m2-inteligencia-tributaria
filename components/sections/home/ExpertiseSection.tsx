import Image from "next/image";

export function ExpertiseSection() {
  return (
    <section className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="max-w-[590px]">
          <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight text-[#12151b] md:text-5xl">
            Expertise que gera confianca
          </h2>

          <p className="mt-7 text-base leading-8 text-[#3b3f47] md:text-xl">
            A M2 Recovery nasceu da necessidade de rigor tecnico no mercado de
            recuperacao de ativos. Com foco exclusivo no ecossistema contabil,
            unimos tecnologia de ponta e inteligencia juridica para entregar
            resultados onde outros veem impossibilidades.
          </p>

          <a
            href="/sobre"
            className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#d7b729] pb-1 text-xl font-black uppercase tracking-wide text-[#12151b] transition-colors hover:text-[#d7b729] md:text-4xl"
          >
            Saiba +
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative mx-auto flex h-[340px] w-full max-w-[520px] items-center justify-center md:h-[420px]">
          <div className="animate-float-slow absolute left-0 top-8 w-[42%] drop-shadow-2xl md:w-[44%]">
            <Image
              src="/imagens/elementos/dinheiro_flutuando_3d.png"
              alt="Dinheiro 3D"
              width={240}
              height={240}
              className="w-full object-contain"
            />
          </div>

          <div className="animate-float-fast absolute bottom-4 left-[28%] w-[34%] drop-shadow-2xl md:w-[36%]">
            <Image
              src="/imagens/elementos/caneta_3d.png"
              alt="Caneta 3D"
              width={200}
              height={200}
              className="w-full object-contain"
            />
          </div>

          <div className="animate-float-medium absolute right-0 top-4 w-[46%] drop-shadow-2xl md:w-[48%]">
            <Image
              src="/imagens/elementos/calculadora_3d.png"
              alt="Calculadora 3D"
              width={260}
              height={260}
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
