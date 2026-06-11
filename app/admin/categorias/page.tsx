"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";

type Category = {
  id: string;
  name: string;
  slug: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const res = await fetch("/api/admin/categories", { credentials: "include" });
      if (!res.ok) {
        setListError("Falha ao carregar categorias.");
        return;
      }
      const data = (await res.json()) as { items: Category[] };
      setCategories(data.items);
    } catch {
      setListError("Falha ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function handleNameChange(value: string) {
    setName(value);
    if (!manualSlug) setSlug(slugify(value));
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setSaving(false);
      setFormError("Falha de CSRF. Recarregue a página.");
      return;
    }

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setFormError(body?.message ?? "Falha ao criar categoria.");
      return;
    }

    setName("");
    setSlug("");
    setManualSlug(false);
    await loadCategories();
  }

  async function handleDelete(id: string, categoryName: string) {
    if (!confirm(`Excluir a categoria "${categoryName}"? Artigos vinculados perderão esta categoria.`)) return;

    setListError(null);
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setListError("Falha de CSRF. Recarregue a página.");
      return;
    }

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!res.ok && res.status !== 204) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setListError(body?.message ?? "Falha ao excluir categoria.");
      return;
    }

    await loadCategories();
  }

  return (
    <AdminShell
      title="Categorias"
      subtitle="Gerencie as categorias do blog."
      primaryAction={{ label: "Voltar para artigos", href: "/admin/posts" }}
    >
      {/* Create form */}
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="mb-4 text-base font-semibold text-white">Nova categoria</h2>
        <form onSubmit={(e) => void handleCreate(e)} className="space-y-4 max-w-lg">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="cat-name">
              Nome *
            </label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="cat-slug">
              Slug *
            </label>
            <input
              id="cat-slug"
              value={slug}
              onChange={(e) => {
                setManualSlug(true);
                setSlug(slugify(e.target.value));
              }}
              required
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          {formError ? <p className="text-sm text-red-400">{formError}</p> : null}

          <div className="pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-6 text-sm font-semibold text-[#12151b] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Criar categoria"}
            </button>
          </div>
        </form>
      </section>

      {/* Category list */}
      <section className="space-y-3">
        {listError ? <p className="text-sm text-red-400">{listError}</p> : null}

        {loading ? (
          <p className="text-sm text-zinc-400">Carregando...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-zinc-400">Nenhuma categoria criada ainda.</p>
        ) : (
          categories.map((category) => (
            <article
              key={category.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{category.name}</p>
                  <p className="text-xs text-zinc-400">/{category.slug}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(category.id, category.name)}
                  className="h-8 rounded-md border border-red-900 bg-red-950/60 px-3 text-xs font-semibold text-red-200"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </AdminShell>
  );
}
