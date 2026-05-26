import Image from "next/image";
import { SlideIn } from "@/components/animations/SlideIn";

export function ExpertiseSection() {
  return (
    <section id="sobre" className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="max-w-[620px]">
          <SlideIn
            from="bottom"
            distance={40}
            duration={900}
            delay={0}
            overflowHidden={false}
          >
            <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight text-[#12151b] md:text-5xl">
              Especialistas em recuperar o que é{" "}
              <span className="text-gold-gradient"> seu </span> por
              <span className="text-gold-gradient"> direito</span>
            </h2>
          </SlideIn>

          <div className="mt-7 space-y-5 text-base leading-8 text-[#3b3f47] md:text-xl">
            <SlideIn
              from="left"
              distance={56}
              duration={880}
              delay={120}
              overflowHidden={false}
            >
              <p>
                A M2 Inteligência Tributária nasceu de uma realidade simples: a
                maioria das empresas brasileiras paga mais imposto do que
                deveria, e não sabe disso. Com base em Juazeiro do Norte (CE),
                Porangatu (GO) e João Pessoa (PB), atuamos em todo o Brasil,
                identificando créditos tributários e recuperando valores com
                rigor técnico e respaldo jurídico.
              </p>
            </SlideIn>
            <SlideIn
              from="right"
              distance={56}
              duration={880}
              delay={220}
              overflowHidden={false}
            >
              <p>
                Nosso modelo é direto: você só paga se recuperarmos. Sem custo
                antecipado, sem burocracia, sem risco.
              </p>
            </SlideIn>
          </div>

          <SlideIn from="bottom" distance={36} duration={800} delay={320} overflowHidden={false}>
            <a
              href="/sobre"
              className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#d7b729] pb-1 text-xl font-black uppercase tracking-wide text-[#12151b] transition-colors hover:text-[#d7b729] md:text-4xl"
            >
              Saiba +
              <span aria-hidden="true">→</span>
            </a>
          </SlideIn>
        </div>

        <SlideIn
          from="bottom"
          distance={72}
          duration={950}
          delay={140}
          className="w-full max-w-[560px] justify-self-center md:justify-self-auto"
          overflowHidden={false}
        >
          <div className="relative mx-auto w-full overflow-hidden shadow-2xl shadow-black/20">
            <Image
              src="/imagens/office/foto_material_m2.jpg"
              alt="Sócios da M2 Inteligência Tributária"
              width={760}
              height={640}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </SlideIn>
      </div>
    </section>
  );
}