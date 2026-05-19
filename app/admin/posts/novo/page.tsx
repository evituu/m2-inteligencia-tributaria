import { AdminShell } from "../../_components/AdminShell";
import { PostEditorForm } from "../../_components/PostEditorForm";

export default function AdminPostNewPage() {
  return (
    <AdminShell
      title="Novo Artigo"
      subtitle="Crie conteúdo com fluxo editorial completo e responsivo."
      primaryAction={{ label: "Voltar para artigos", href: "/admin/posts" }}
    >
      <PostEditorForm mode="create" />
    </AdminShell>
  );
}

