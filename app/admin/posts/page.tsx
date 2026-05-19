"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "../_components/AdminShell";

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | AdminPost["status"]>("all");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const computedSlug = useMemo(() => slugify(title), [title]);

  async function getCsrfToken() {
    const response = await fetch("/api/auth/csrf", { method: "GET" });
    const data = (await response.json()) as { csrfToken?: string };
    return data.csrfToken || "";
  }

  async function loadPosts() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/posts");
    if (!response.ok) {
      setError("Não foi possível carregar os posts.");
      setLoading(false);
      return;
    }

    const data = (await response.json()) as { items: AdminPost[] };
    setPosts(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const csrfToken = await getCsrfToken();

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: title.trim(),
        slug: computedSlug,
        content: content.trim(),
        status: "draft",
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "Falha ao criar post.");
      return;
    }

    setTitle("");
    setContent("");
    await loadPosts();
  }

  async function updateStatus(postId: string, status: AdminPost["status"]) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setError("Falha ao atualizar status do post.");
      return;
    }

    await loadPosts();
  }

  async function removePost(postId: string) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!response.ok && response.status !== 204) {
      setError("Falha ao excluir post.");
      return;
    }

    await loadPosts();
  }

  const filteredPosts = posts.filter((post) => {
    const statusMatches = statusFilter === "all" || post.status === statusFilter;
    const searchValue = search.trim().toLowerCase();
    const searchMatches =
      searchValue.length === 0 ||
      post.title.toLowerCase().includes(searchValue) ||
      post.slug.toLowerCase().includes(searchValue);

    return statusMatches && searchMatches;
  });

  return (
    <AdminShell
      title="Artigos"
      subtitle="Gerencie status editorial, busca e publicações do blog."
      primaryAction={{ label: "Inserir novo artigo", href: "/admin/posts/novo" }}
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | AdminPost["status"])}
            className="h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
          >
            <option value="all">Todos os status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="archived">Desativados</option>
          </select>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por título ou slug"
            className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Rascunho rápido</h2>
        <p className="mt-1 text-sm text-zinc-400">Atalho para criar um rascunho agora.</p>

        <form className="mt-4 space-y-3" onSubmit={handleCreate}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título do post"
            className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
            required
          />
          <input
            value={computedSlug}
            readOnly
            placeholder="slug-gerado"
            className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-500"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Conteúdo do post"
            className="min-h-28 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            required
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-4 text-sm font-semibold text-[#12151b] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Criar rascunho"}
            </button>
            <Link
              href="/admin/posts/novo"
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-semibold text-zinc-200"
            >
              Abrir formulário completo
            </Link>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Lista de artigos</h2>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

        {loading ? <p className="mt-4 text-sm text-zinc-400">Carregando...</p> : null}

        {!loading && filteredPosts.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">Nenhum artigo encontrado para o filtro atual.</p>
        ) : null}

        {!loading && filteredPosts.length > 0 ? (
          <div className="mt-4 space-y-3">
            {filteredPosts.map((post) => (
              <article key={post.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{post.title}</p>
                    <p className="text-xs text-zinc-400">
                      /{post.slug} • {post.status} • {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "published")}
                      className="h-8 rounded-md border border-emerald-800 bg-emerald-900/40 px-3 text-xs font-semibold text-emerald-200"
                    >
                      Publicar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "draft")}
                      className="h-8 rounded-md border border-amber-800 bg-amber-900/40 px-3 text-xs font-semibold text-amber-200"
                    >
                      Rascunho
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "archived")}
                      className="h-8 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-xs font-semibold text-zinc-200"
                    >
                      Desativar
                    </button>
                    <button
                      type="button"
                      onClick={() => removePost(post.id)}
                      className="h-8 rounded-md border border-red-900 bg-red-950/60 px-3 text-xs font-semibold text-red-200"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}

