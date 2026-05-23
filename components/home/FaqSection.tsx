"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Minha empresa tem direito à recuperação tributária?",
    answer:
      "Provavelmente sim. A maior parte das empresas nos regimes de Lucro Real, Lucro Presumido ou Simples Nacional tem ao menos uma tese aplicável. A melhor forma de saber é com a análise gratuita que oferecemos.",
  },
  {
    question: "Quais regimes tributários podem ser analisados?",
    answer:
      "Atendemos empresas nos três principais regimes: Lucro Real, Lucro Presumido e Simples Nacional. Cada regime tem teses específicas, e nossa equipe identifica qual se aplica ao seu caso.",
  },
  {
    question: "A análise inicial tem custo?",
    answer:
      "Não. A análise prévia é 100% gratuita e sem compromisso. Avaliamos o potencial antes de qualquer proposta.",
  },
  {
    question: "Quais documentos são necessários para começar?",
    answer:
      "Inicialmente, é necessário o acesso ao certificado digital da empresa (e-CNPJ) ou uma procuração digital habilitada via Portal e-CAC. Com isso, nossa equipe consegue acessar as informações contábeis e fiscais necessárias para realizar a análise técnica com segurança e precisão.",
  },
  {
    question: "O crédito é recebido em dinheiro ou usado para compensação?",
    answer:
      "Os créditos tributários podem ser utilizados de duas formas, dependendo da situação da empresa e da estratégia tributária adotada: por meio de compensação de tributos federais vincendos ou, em alguns casos específicos, via restituição em dinheiro. Nossa equipe realiza toda a análise técnica para identificar a alternativa mais segura e vantajosa para cada empresa.",
  },
  {
    question: "Quanto é o prazo da análise?",
    answer:
      "Com toda a documentação e os acessos necessários em mãos, os resultados da análise são entregues em até 72 horas.",
  },
  {
    question: "A Receita Federal pode questionar?",
    answer:
      "Os processos de recuperação tributária seguem critérios técnicos e legais previstos na legislação vigente ou validação por parte da Receita Federal. Por isso, a M2 Inteligência Tributária realiza análises técnicas fundamentadas na legislação vigente, em documentos fiscais e em cruzamentos de dados, garantindo maior segurança jurídica e conformidade em cada processo realizado.",
  },
  {
    question: "Como funcionam os honorários?",
    answer:
      "Trabalhamos com honorários condicionados ao êxito: você só paga se houver recuperação efetiva. O percentual é definido em contrato antes de qualquer trabalho, com total transparência.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-zinc-700 py-16 md:py-24">
      <div className="mx-auto w-full max-w-[920px] px-5 md:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#1a1f27] px-6 py-10 shadow-2xl shadow-black/25 md:px-10">
          <div className="mb-10 text-center">
            <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
            <h2 className="text-4xl font-black uppercase tracking-tight text-gold-gradient md:text-5xl">
              Tire suas dúvidas antes de começar
            </h2>
            <p className="mt-4 text-base text-zinc-300 md:text-lg">
              Tudo que você precisa saber antes de dar o primeiro passo.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="border-t border-[#f2c40f]/35"
          >
            {faqs.map(({ question, answer }) => (
              <AccordionItem
                key={question}
                value={question}
                className="border-b border-[#f2c40f]/25"
              >
                <AccordionTrigger className="py-5 text-left text-base font-bold hover:no-underline md:text-lg">
                  <span className="text-zinc-300 hover:text-white">{question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-zinc-200 md:text-base">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
