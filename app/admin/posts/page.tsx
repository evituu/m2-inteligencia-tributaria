"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-extrabold text-[#12151b]">Admin - Posts</h1>
      <p className="mt-2 text-sm text-zinc-600">Gerencie posts do blog em tempo real.</p>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#12151b]">Novo post</h2>
        <form className="mt-4 space-y-3" onSubmit={handleCreate}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título do post"
            className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm"
            required
          />
          <input
            value={computedSlug}
            readOnly
            placeholder="slug-gerado"
            className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Conteúdo do post"
            className="min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="h-10 rounded-md bg-[#12151b] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Criar rascunho"}
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#12151b]">Posts</h2>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        {loading ? <p className="mt-4 text-sm text-zinc-600">Carregando...</p> : null}

        {!loading && posts.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">Nenhum post cadastrado.</p>
        ) : null}

        {!loading && posts.length > 0 ? (
          <div className="mt-4 space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#12151b]">{post.title}</p>
                  <p className="text-xs text-zinc-500">
                    /{post.slug} • {post.status} •{" "}
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(post.id, "published")}
                    className="h-8 rounded-md border border-emerald-300 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700"
                  >
                    Publicar
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(post.id, "archived")}
                    className="h-8 rounded-md border border-amber-300 bg-amber-50 px-3 text-xs font-semibold text-amber-700"
                  >
                    Arquivar
                  </button>
                  <button
                    type="button"
                    onClick={() => removePost(post.id)}
                    className="h-8 rounded-md border border-red-300 bg-red-50 px-3 text-xs font-semibold text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
