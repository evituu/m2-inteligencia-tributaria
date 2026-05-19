"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AdminShell } from "../../../_components/AdminShell";
import { PostEditorForm, normalizeInitialPostData } from "../../../_components/PostEditorForm";

type AdminPostResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published" | "archived";
  coverImageUrl: string | null;
  publishedAt: string | null;
  categoryId: string | null;
};

export default function AdminPostEditPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<AdminPostResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/posts/${postId}`, { method: "GET" }).catch(() => null);

      if (!response || !response.ok) {
        if (!cancelled) {
          setError("Nao foi possivel carregar o artigo para edicao.");
          setLoading(false);
        }
        return;
      }

      const data = (await response.json()) as AdminPostResponse;

      if (!cancelled) {
        setPost(data);
        setLoading(false);
      }
    }

    if (postId) {
      void loadPost();
    }

    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <AdminShell
      title="Editar Artigo"
      subtitle="Atualize campos editoriais e status com feedback imediato."
      primaryAction={{ label: "Voltar para artigos", href: "/admin/posts" }}
    >
      {loading ? (
        <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-6">
          <p className="text-sm text-zinc-400">Carregando dados do artigo...</p>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
          <p className="text-sm text-red-300">{error}</p>
        </section>
      ) : null}

      {!loading && post ? <PostEditorForm mode="edit" initialData={normalizeInitialPostData(post)} /> : null}
    </AdminShell>
  );
}

