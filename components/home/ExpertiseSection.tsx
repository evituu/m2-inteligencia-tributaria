import Image from "next/image";

export function ExpertiseSection() {
  return (
    <section id="sobre" className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="max-w-[620px]">
          <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight text-[#12151b] md:text-5xl">
            Especialistas em recuperar o que é seu por direito
          </h2>

          <div className="mt-7 space-y-5 text-base leading-8 text-[#3b3f47] md:text-xl">
            <p>
              A M2 Inteligência Tributária nasceu de uma realidade simples: a
              maioria das empresas brasileiras paga mais imposto do que deveria,
              e não sabe disso. Com base em Juazeiro do Norte (CE) e Porangatu
              (GO), atuamos em todo o Brasil, identificando créditos tributários
              e recuperando valores com rigor técnico e respaldo jurídico.
            </p>
            <p>
              Nosso modelo é direto: você só paga se recuperarmos. Sem custo
              antecipado, sem burocracia, sem risco.
            </p>
          </div>

          <a
            href="/sobre"
            className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#d7b729] pb-1 text-xl font-black uppercase tracking-wide text-[#12151b] transition-colors hover:text-[#d7b729] md:text-4xl"
          >
            Saiba +
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] overflow-hidden shadow-2xl shadow-black/20">
          <Image
            src="/imagens/office/m2_lideres_socios.png"
            alt="Sócios da M2 Inteligência Tributária"
            width={760}
            height={640}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
