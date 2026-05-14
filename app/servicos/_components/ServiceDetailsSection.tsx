interface ServiceDetail {
  slug: string;
  title: string;
  whatIs: string;
  indicatedFor: string;
  howWeAct: string;
  documents: string[];
  benefit: string;
}

const details: ServiceDetail[] = [
  {
    slug: "pis-cofins-monofasicos",
    title: "Recuperação de PIS e COFINS sobre produtos monofásicos",
    whatIs:
      "Produtos monofásicos sofrem tributação concentrada na indústria. Quando revendedores aplicam alíquotas tributárias sobre esses produtos, ocorre pagamento indevido — passível de restituição.",
    indicatedFor:
      "Postos de combustíveis, farmácias, perfumarias, autopeças, revendas de pneus e demais comércios que comercializam produtos monofásicos.",
    howWeAct:
      "Mapeamos os produtos do mix com tributação monofásica, cruzamos com as notas fiscais emitidas e identificamos os valores recolhidos a maior nos últimos cinco anos.",
    documents: [
      "XMLs de entrada e saída",
      "Escriturações fiscais (EFD-Contribuições)",
      "Relatórios de faturamento",
      "Procuração e-CAC ou certificado digital",
    ],
    benefit:
      "Restituição em espécie ou compensação com tributos federais futuros, gerando caixa imediato com base 100% documental.",
  },
  {
    slug: "exclusao-icms-pis-cofins",
    title: "Exclusão do ICMS da base do PIS e da COFINS",
    whatIs:
      "Tese consolidada pelo STF (RE 574.706) que reconhece a exclusão do ICMS da base de cálculo do PIS e da COFINS, permitindo a recuperação dos valores recolhidos a maior nos últimos cinco anos.",
    indicatedFor:
      "Empresas tributadas pelo Lucro Real ou Lucro Presumido, com faturamento sujeito ao PIS e à COFINS sobre a receita bruta.",
    howWeAct:
      "Levantamos a base de cálculo histórica, segregamos o ICMS destacado em nota e apuramos o crédito a recuperar, com memória de cálculo detalhada por competência.",
    documents: [
      "Notas fiscais de saída",
      "EFD-Contribuições e EFD-ICMS/IPI",
      "Declarações DCTF e PER/DCOMP anteriores",
      "Procuração e-CAC",
    ],
    benefit:
      "Restituição ou compensação tributária com base em entendimento consolidado pelo STF, com risco fiscal mínimo.",
  },
  {
    slug: "creditos-previdenciarios",
    title: "Recuperação de créditos previdenciários",
    whatIs:
      "Diversas verbas pagas a colaboradores possuem natureza indenizatória e não deveriam compor a base de cálculo das contribuições previdenciárias.",
    indicatedFor:
      "Empresas com folha de pagamento relevante, especialmente as que possuem alta rotatividade, horas extras, adicional noturno, aviso prévio e auxílios indenizatórios.",
    howWeAct:
      "Revisamos rubricas da folha, cruzamos com o eSocial, EFD-Reinf e DCTFWeb e apuramos os valores recolhidos indevidamente nos últimos cinco anos.",
    documents: [
      "Folhas de pagamento detalhadas",
      "Arquivos do eSocial",
      "EFD-Reinf e DCTFWeb",
      "DARFs previdenciários",
    ],
    benefit:
      "Compensação direta com contribuições previdenciárias futuras, reduzindo o custo da folha sem alterar a operação.",
  },
  {
    slug: "irpj-csll-evaporacao",
    title: "Dedução de IRPJ e CSLL por perdas com evaporação",
    whatIs:
      "A evaporação de combustíveis e gás é uma perda operacional natural e mensurável, que, quando documentada por laudo técnico, pode ser deduzida da base do IRPJ e da CSLL.",
    indicatedFor:
      "Postos de combustíveis, revendas de gás GLP e distribuidoras com perdas operacionais documentadas e relevantes.",
    howWeAct:
      "Elaboramos laudo técnico de perdas, integramos com a escrituração contábil e fiscal e ajustamos a base do IRPJ/CSLL conforme legislação vigente.",
    documents: [
      "Relatórios de movimentação de tanques",
      "Notas fiscais de compra e venda",
      "Escrituração contábil (ECD/ECF)",
      "Laudo técnico de perdas (elaborado pela M2)",
    ],
    benefit:
      "Redução legítima da carga tributária sobre o lucro, com fundamentação técnica auditável.",
  },
  {
    slug: "laudo-perdas-alimenticio",
    title: "Laudo técnico de perdas no setor alimentício",
    whatIs:
      "O setor alimentício possui perdas naturais (resfriamento, manipulação, validade, quebras) que, quando devidamente quantificadas e documentadas, têm efeito tributário direto.",
    indicatedFor:
      "Açougues, frigoríficos, supermercados, padarias, bares, restaurantes e indústrias alimentícias.",
    howWeAct:
      "Realizamos análise técnica e operacional, mensuramos as perdas com base em metodologia própria e formalizamos via laudo aceito pelo fisco.",
    documents: [
      "Controles internos de perdas e quebras",
      "Movimentação de estoque",
      "Notas fiscais de entrada e saída",
      "ECD/ECF",
    ],
    benefit:
      "Reconhecimento contábil e fiscal das perdas, com impacto direto em IRPJ, CSLL e na conformidade fiscal da empresa.",
  },
];

export function ServiceDetailsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 max-w-[760px]">
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Como cada serviço funciona
          </h2>
          <p className="mt-5 text-base leading-7 text-[#3b3f47] md:text-lg">
            Conheça em detalhe o que está por trás de cada serviço da M2: o que
            é, para quem é indicado, como atuamos, documentos necessários e o
            benefício gerado.
          </p>
        </div>

        <div className="space-y-12">
          {details.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="scroll-mt-24 rounded-xl border border-zinc-200 bg-[#fafafa] p-6 shadow-sm md:p-10"
            >
              <h3 className="text-2xl font-black tracking-tight text-[#12151b] md:text-3xl">
                {item.title}
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <DetailBlock label="O que é" content={item.whatIs} />
                <DetailBlock label="Para quem é indicado" content={item.indicatedFor} />
                <DetailBlock label="Como a M2 atua" content={item.howWeAct} />
                <DetailBlock label="Benefício para a empresa" content={item.benefit} />
              </div>

              <div className="mt-7 rounded-lg border border-[#f2c40f]/35 bg-[#f2c40f]/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">
                  Documentos que podem ser necessários
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.documents.map((doc) => (
                    <li
                      key={doc}
                      className="flex items-start gap-2 text-sm text-[#3b3f47]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#f2c40f]"
                      />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailBlock({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9a227]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[#3b3f47] md:text-base">
        {content}
      </p>
    </div>
  );
}
