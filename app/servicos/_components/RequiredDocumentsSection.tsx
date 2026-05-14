import { FileSpreadsheet, FolderOpen, KeyRound, Users } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface DocGroup {
  title: string;
  description: string;
  items: string[];
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const docGroups: DocGroup[] = [
  {
    title: "Documentos fiscais",
    description: "Base de toda análise tributária e ponto de partida do diagnóstico.",
    items: [
      "XMLs de notas fiscais (entrada e saída)",
      "Escriturações fiscais (EFD-Contribuições, EFD-ICMS/IPI, ECD, ECF)",
      "Relatórios de faturamento por período",
    ],
    icon: FileSpreadsheet,
  },
  {
    title: "Acesso fiscal",
    description: "Necessário para consultas e formalização junto à Receita Federal.",
    items: [
      "Procuração eletrônica no e-CAC",
      "Certificado digital A1 ou A3 da empresa",
      "Comprovante de inscrição CNPJ atualizado",
    ],
    icon: KeyRound,
  },
  {
    title: "Folha de pagamento",
    description: "Necessário para revisão previdenciária e identificação de créditos.",
    items: [
      "Arquivos detalhados de folha de pagamento",
      "Eventos do eSocial",
      "EFD-Reinf e DCTFWeb",
      "DARFs previdenciários quitados",
    ],
    icon: Users,
  },
  {
    title: "Documentos complementares",
    description: "Reforçam a memória de cálculo e a segurança da operação.",
    items: [
      "Memórias de cálculo internas",
      "Controles de estoque, perdas e quebras",
      "Laudos técnicos anteriores",
      "Relatórios gerenciais relevantes",
    ],
    icon: FolderOpen,
  },
];

export function RequiredDocumentsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 max-w-[760px]">
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Documentos necessários
          </h2>
          <p className="mt-5 text-base leading-7 text-[#3b3f47] md:text-lg">
            A análise é totalmente baseada em documentação oficial da empresa,
            garantindo segurança jurídica e auditabilidade do processo.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {docGroups.map(({ title, description, items, icon: Icon }) => (
            <article
              key={title}
              className="h-full border-l-4 border-[#f2c40f] bg-[#fafafa] px-6 py-7 shadow-sm md:px-8 md:py-8"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f2c40f]/15 text-[#c9a227]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#12151b]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#3b3f47]">
                {description}
              </p>

              <ul className="mt-4 space-y-2 text-sm leading-7 text-[#3b3f47]">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#f2c40f]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
