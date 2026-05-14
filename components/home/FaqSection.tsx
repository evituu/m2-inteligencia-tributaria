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
      "Empresas que recolhem PIS, COFINS, INSS sobre a folha, IRPJ e CSLL podem ter créditos a recuperar. A confirmação só ocorre após o diagnóstico técnico inicial, que analisa o regime, segmento e documentos fiscais.",
  },
  {
    question: "Quais regimes tributários podem ser analisados?",
    answer:
      "Atuamos com empresas dos regimes Lucro Real, Lucro Presumido e, em algumas situações específicas, Simples Nacional. Cada regime possui oportunidades particulares de revisão.",
  },
  {
    question: "A análise inicial tem custo?",
    answer:
      "Não. A análise inicial é gratuita e tem como objetivo identificar se existem oportunidades reais de recuperação para a sua empresa, antes de qualquer formalização.",
  },
  {
    question: "Quais documentos são necessários para começar?",
    answer:
      "Em geral: notas fiscais (XMLs), escriturações fiscais, folha de pagamento, eSocial, EFD-Reinf, DCTFWeb e acesso ao e-CAC via procuração ou certificado digital. A lista completa é definida após o diagnóstico inicial.",
  },
  {
    question: "O crédito é recebido em dinheiro ou usado para compensação?",
    answer:
      "Depende do caso. Pode ser via restituição em espécie, compensação com tributos federais futuros ou via PER/DCOMP. A definição é feita em conjunto com a empresa, considerando o cenário tributário e o fluxo de caixa.",
  },
  {
    question: "Quanto tempo demora o processo?",
    answer:
      "A análise técnica e a apuração dos créditos costumam levar entre 30 e 90 dias, dependendo do volume documental. O recebimento ou compensação varia conforme o processo administrativo junto à Receita Federal.",
  },
  {
    question: "A Receita Federal pode questionar?",
    answer:
      "Toda operação é conduzida com base documental sólida, memória de cálculo e fundamentação técnica/jurídica. Eventuais questionamentos são respondidos com a documentação que ampara cada crédito apurado.",
  },
  {
    question: "Como funcionam os honorários?",
    answer:
      "Trabalhamos com honorários de êxito — você só paga quando o crédito é efetivamente apurado e disponibilizado para compensação ou restituição. Os percentuais são definidos em contrato, com total transparência.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[920px] px-5 md:px-8">
        <div className="mb-10 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-base text-[#3b3f47] md:text-lg">
            Esclarecemos as principais dúvidas sobre recuperação tributária e
            previdenciária.
          </p>
        </div>

        <Accordion type="single" collapsible className="border-t border-zinc-200">
          {faqs.map(({ question, answer }) => (
            <AccordionItem
              key={question}
              value={question}
              className="border-b border-zinc-200"
            >
              <AccordionTrigger className="py-5 text-base font-bold text-[#12151b] md:text-lg">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-[#3b3f47] md:text-base">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
