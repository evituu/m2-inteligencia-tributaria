"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostStatus = "draft" | "published" | "archived";

type CategoryOption = {
  id: string;
  name: string;
};

type InitialPostData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  coverImageUrl: string;
  publishedAt: string;
  categoryId: string;
};

type PostEditorFormProps = {
  mode: "create" | "edit";
  initialData?: InitialPostData;
  initialCategories?: CategoryOption[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

async function getCsrfToken() {
  const response = await fetch("/api/auth/csrf", { method: "GET" });
  const data = (await response.json()) as { csrfToken?: string };
  return data.csrfToken || "";
}

export function PostEditorForm({ mode, initialData, initialCategories = [] }: PostEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [status, setStatus] = useState<PostStatus>(initialData?.status ?? "draft");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? "");
  const [publishedAt, setPublishedAt] = useState(initialData?.publishedAt ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [categories, setCategories] = useState<CategoryOption[]>(initialCategories);
  const [manualSlug, setManualSlug] = useState(Boolean(initialData?.slug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => title.trim().length >= 3 && content.trim().length > 0, [title, content]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      const response = await fetch("/api/admin/categories", { method: "GET" }).catch(() => null);
      if (!response || !response.ok) return;

      const data = (await response.json()) as { items?: CategoryOption[] };
      if (!cancelled) {
        setCategories(data.items ?? []);
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!manualSlug) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setManualSlug(true);
    setSlug(slugify(value));
  }

  async function submitWithStatus(nextStatus: PostStatus) {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const csrfToken = await getCsrfToken();
    const endpoint = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      status: nextStatus,
      coverImageUrl: coverImageUrl.trim() || undefined,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      categoryId: categoryId || undefined,
    };

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "Não foi possível salvar o artigo.");
      return;
    }

    setStatus(nextStatus);
    setSuccess(mode === "create" ? "Artigo criado com sucesso." : "Artigo atualizado com sucesso.");
    router.refresh();

    if (mode === "create") {
      const created = (await response.json().catch(() => null)) as { id?: string } | null;
      if (created?.id) {
        router.push(`/admin/posts/${created.id}/editar`);
      }
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-200">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Ex.: Reforma tributária: impactos para PMEs"
              className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-zinc-200">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="reforma-tributaria-impactos-pmes"
              className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-zinc-200">
              Resumo
            </Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Resumo curto para listagem do blog"
              className="min-h-24 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-zinc-200">
              Conteúdo
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escreva o conteúdo completo do artigo..."
              className="min-h-56 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>
        </div>

        <aside className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-zinc-200">
              Status
            </Label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as PostStatus)}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-zinc-200">
              Categoria (opcional)
            </Label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100"
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImageUrl" className="text-zinc-200">
              URL da capa (opcional)
            </Label>
            <Input
              id="coverImageUrl"
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              placeholder="https://..."
              className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt" className="text-zinc-200">
              Data de publicação (opcional)
            </Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
              className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

          <div className="sticky bottom-0 z-10 -mx-4 border-t border-zinc-800 bg-[#060b12] px-4 py-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() => submitWithStatus("draft")}
                disabled={!canSubmit || submitting}
                className="h-10 bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
              >
                Salvar rascunho
              </Button>
              <Button
                type="button"
                onClick={() => submitWithStatus("published")}
                disabled={!canSubmit || submitting}
                className="h-10 bg-[#f2c40f] text-[#12151b] hover:bg-[#e3b80d]"
              >
                Publicar
              </Button>
              <Button
                type="button"
                onClick={() => submitWithStatus("archived")}
                disabled={!canSubmit || submitting}
                className="h-10 border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 sm:col-span-2"
              >
                Arquivar
              </Button>
              <Button asChild type="button" variant="ghost" className="h-10 text-zinc-300 sm:col-span-2">
                <Link href="/admin/posts">Cancelar e voltar</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function normalizeInitialPostData(raw: {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  status?: PostStatus;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  categoryId?: string | null;
}): InitialPostData {
  return {
    id: raw.id,
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    excerpt: raw.excerpt ?? "",
    content: raw.content ?? "",
    status: raw.status ?? "draft",
    coverImageUrl: raw.coverImageUrl ?? "",
    publishedAt: toDatetimeLocal(raw.publishedAt),
    categoryId: raw.categoryId ?? "",
  };
}
