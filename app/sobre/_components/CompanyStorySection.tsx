import { TypingText } from "@/components/animations/TypingText";
import { SlideIn } from "@/components/animations/SlideIn";

export function CompanyStorySection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase leading-[1.08] tracking-tight text-[#12151b] md:text-5xl">
            Nossa{" "}
            <TypingText
              text="Trajetória"
              typingSpeed={90}
              deletingSpeed={55}
              pauseAfterTyping={1200}
              restartInterval={4000}
              className="text-[#f2c40f]"
            />
          </h2>

          <SlideIn from="left" delay={250} duration={1000}>
            <p className="mt-8 text-base leading-8 text-[#3b3f47] md:text-lg">
              Fundada com o propósito de desmistificar a carga tributária
              brasileira, a M2 Inteligência Tributária nasceu da visão de
              especialistas inconformados com as ineficiências do sistema.
            </p>
          </SlideIn>

          <SlideIn from="right" delay={300} duration={1000}>
            <p className="mt-5 text-base leading-8 text-[#3b3f47] md:text-lg">
              Ao longo de nossa história, construímos uma metodologia sólida e
              transparente, recuperando milhões em ativos para empresas de
              diversos setores. Nosso compromisso vai além do número; buscamos a
              perenidade e a saúde financeira de cada cliente que confia em nossa
              expertise.
            </p>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}
