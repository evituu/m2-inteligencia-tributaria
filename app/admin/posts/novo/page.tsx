import Link from "next/link";
import { AdminShell } from "../../_components/AdminShell";

export default function AdminPostNewPage() {
  return (
    <AdminShell
      title="Novo Artigo"
      subtitle="Formulário completo será implementado na próxima fase."
      primaryAction={{ label: "Voltar para artigos", href: "/admin/posts" }}
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-6">
        <h2 className="text-xl font-bold text-white">Editor em construção</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Esta fase já entrega o shell responsivo e fluxo de navegação. Na próxima etapa, entra o formulário
          completo com campos editoriais, categorias, status e ações de publicação.
        </p>
        <div className="mt-5">
          <Link
            href="/admin/posts"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-4 text-sm font-semibold text-[#12151b]"
          >
            Ir para lista de artigos
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}

