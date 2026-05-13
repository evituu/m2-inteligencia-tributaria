import Image from "next/image";

export function ExpertiseSection() {
  return (
    <section className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="relative mx-auto w-full max-w-[560px]">
          <span className="absolute -left-3 -top-3 h-18 w-18 border-l-4 border-t-4 border-[#d7b729] md:-left-4 md:-top-4" />
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-300 shadow-lg">
            <Image
              src="/imagens/office/foto_calculadora_m2.png"
              alt="Mesa com calculadora e documentos contabeis"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

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
            href="#"
            className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#d7b729] pb-1 text-xl font-black uppercase tracking-wide text-[#12151b] transition-colors hover:text-[#d7b729] md:text-4xl"
          >
            Saiba mais sobre a M2
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
