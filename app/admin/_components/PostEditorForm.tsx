"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "./DateTimePicker";

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
  const response = await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) return "";
  const data = (await response.json()) as { csrfToken?: string };
  return data.csrfToken || "";
}

export function PostEditorForm({ mode, initialData, initialCategories = [] }: PostEditorFormProps) {
  const router = useRouter();
  const storageKey = useMemo(() => {
    return mode === "create" ? "m2:post-editor:create" : `m2:post-editor:edit:${initialData?.id ?? "unknown"}`;
  }, [mode, initialData?.id]);
  const persistedDraft = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Partial<InitialPostData>;
    } catch {
      return null;
    }
  }, [storageKey]);

  const [title, setTitle] = useState(persistedDraft?.title ?? initialData?.title ?? "");
  const [slug, setSlug] = useState(persistedDraft?.slug ?? initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(persistedDraft?.excerpt ?? initialData?.excerpt ?? "");
  const [content, setContent] = useState(persistedDraft?.content ?? initialData?.content ?? "");
  const [status, setStatus] = useState<PostStatus>(persistedDraft?.status ?? initialData?.status ?? "draft");
  const [coverImageUrl, setCoverImageUrl] = useState(persistedDraft?.coverImageUrl ?? initialData?.coverImageUrl ?? "");
  const [publishedAt, setPublishedAt] = useState(persistedDraft?.publishedAt ?? initialData?.publishedAt ?? "");
  const [categoryId, setCategoryId] = useState(persistedDraft?.categoryId ?? initialData?.categoryId ?? "");
  const [categories, setCategories] = useState<CategoryOption[]>(initialCategories);
  const [manualSlug, setManualSlug] = useState(Boolean((persistedDraft?.slug ?? initialData?.slug)?.trim()));
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [autosaveState, setAutosaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const skipUnloadGuardRef = useRef(false);
  const isSavingRemoteRef = useRef(false);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);


  const canSubmit = useMemo(() => title.trim().length >= 3 && content.trim().length > 0, [title, content]);
  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        status,
        coverImageUrl: coverImageUrl.trim(),
        publishedAt,
        categoryId,
      }),
    [title, slug, excerpt, content, status, coverImageUrl, publishedAt, categoryId],
  );
  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        title: initialData?.title?.trim() ?? "",
        slug: initialData?.slug?.trim() ?? "",
        excerpt: initialData?.excerpt?.trim() ?? "",
        content: initialData?.content?.trim() ?? "",
        status: initialData?.status ?? "draft",
        coverImageUrl: initialData?.coverImageUrl?.trim() ?? "",
        publishedAt: initialData?.publishedAt ?? "",
        categoryId: initialData?.categoryId ?? "",
      }),
    [initialData],
  );
  const hasUnsavedChanges = currentSnapshot !== initialSnapshot;

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

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        status,
        coverImageUrl,
        publishedAt,
        categoryId,
      }),
    );
  }, [storageKey, title, slug, excerpt, content, status, coverImageUrl, publishedAt, categoryId]);

  useEffect(() => {
    if (mode !== "edit" || !initialData?.id || !hasUnsavedChanges || !canSubmit) return;
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);

    autosaveTimeoutRef.current = setTimeout(async () => {
      if (isSavingRemoteRef.current) return;

      isSavingRemoteRef.current = true;
      setAutosaveState("saving");

      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) {
          setAutosaveState("error");
          setError("Nao foi possivel validar CSRF. Recarregue a pagina e tente novamente.");
          return;
        }
        const response = await fetch(`/api/admin/posts/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim() || undefined,
            content: content.trim(),
            status,
            coverImageUrl: coverImageUrl.trim() || undefined,
            publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
            categoryId: categoryId || undefined,
          }),
        });

        if (!response.ok) {
          setAutosaveState("error");
          return;
        }

        setAutosaveState("saved");
      } catch {
        setAutosaveState("error");
      } finally {
        isSavingRemoteRef.current = false;
      }
    }, 1800);

    return () => {
      if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    };
  }, [
    mode,
    initialData?.id,
    hasUnsavedChanges,
    canSubmit,
    title,
    slug,
    excerpt,
    content,
    status,
    coverImageUrl,
    publishedAt,
    categoryId,
  ]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges || skipUnloadGuardRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

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
    if (!csrfToken) {
      setSubmitting(false);
      setError("Nao foi possivel validar CSRF. Recarregue a pagina e tente novamente.");
      return;
    }
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
      setError(body?.message || "Nao foi possivel salvar o artigo.");
      return;
    }

    setStatus(nextStatus);
    setSuccess(mode === "create" ? "Artigo criado com sucesso." : "Artigo atualizado com sucesso.");
    skipUnloadGuardRef.current = true;
    window.localStorage.removeItem(storageKey);
    router.refresh();

    if (mode === "create") {
      const created = (await response.json().catch(() => null)) as { id?: string } | null;
      if (created?.id) {
        router.push(`/admin/posts/${created.id}/editar`);
      }
    }
  }

  async function handleCoverUpload(file: File | null) {
    if (!file || uploadingCover) return;

    setUploadingCover(true);
    setError(null);
    setSuccess(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setUploadingCover(false);
      setError("Nao foi possivel validar CSRF. Recarregue a pagina e tente novamente.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads/cover", {
      method: "POST",
      headers: {
        "x-csrf-token": csrfToken,
      },
      body: formData,
    });

    setUploadingCover(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "Nao foi possivel enviar a capa.");
      return;
    }

    const data = (await response.json()) as { url: string };
    setCoverImageUrl(data.url);
    setSuccess("Capa enviada com sucesso.");
  }

  function handleProtectedNavigation(href: string) {
    if (!hasUnsavedChanges || skipUnloadGuardRef.current) {
      router.push(href);
      return;
    }

    const confirmed = window.confirm("Voce tem alteracoes nao salvas. Deseja sair desta pagina mesmo assim?");
    if (!confirmed) return;

    skipUnloadGuardRef.current = true;
    router.push(href);
  }

  function insertMarkdown(
    before: string,
    after = "",
    placeholder = "texto",
  ) {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const next =
      content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  const toolbarActions = [
    { label: "B",   title: "Negrito",         action: () => insertMarkdown("**", "**", "negrito") },
    { label: "I",   title: "Itálico",          action: () => insertMarkdown("*", "*", "itálico") },
    { label: "H2",  title: "Título",           action: () => insertMarkdown("## ", "", "Título") },
    { label: "H3",  title: "Subtítulo",        action: () => insertMarkdown("### ", "", "Subtítulo") },
    { label: "〝〞", title: "Citação",          action: () => insertMarkdown("> ", "", "citação") },
    { label: "—",   title: "Lista",            action: () => insertMarkdown("- ", "", "item") },
    { label: "1.",  title: "Lista numerada",   action: () => insertMarkdown("1. ", "", "item") },
    { label: "`  `", title: "Código inline",   action: () => insertMarkdown("`", "`", "código") },
    { label: "🔗",  title: "Link",             action: () => insertMarkdown("[", "](url)", "texto do link") },
  ] as const;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className="text-zinc-200">
                Titulo
              </Label>
              <span className={`text-xs ${title.length >= 110 ? "text-amber-400" : "text-zinc-500"}`}>
                {title.length}/120
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Ex.: Reforma tributaria: impactos para PMEs"
              maxLength={120}
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
              Conteudo (Markdown)
            </Label>
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 focus-within:border-zinc-500">
              <div className="flex flex-wrap gap-px border-b border-zinc-700 bg-zinc-800 p-1">
                {toolbarActions.map((btn) => (
                  <button
                    key={btn.title}
                    type="button"
                    title={btn.title}
                    onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
                    className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded px-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={contentRef}
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Escreva o conteudo completo do artigo..."
                className="min-h-56 w-full resize-y overflow-x-hidden break-words bg-transparent px-2.5 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="min-w-0 space-y-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Preview do artigo</p>
            <h3 className="break-words text-xl font-semibold text-zinc-100">{title.trim() || "Titulo do artigo"}</h3>
            <p className="break-words text-sm text-zinc-300">{excerpt.trim() || "Resumo do artigo para a listagem."}</p>
            <div className="max-h-80 max-w-none overflow-y-auto overflow-x-hidden break-words rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-sm leading-6 text-zinc-200 prose prose-sm prose-invert [&_*]:max-w-full [&_*]:break-words">
              {content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <span className="text-zinc-500">O conteudo completo aparece aqui em tempo real para revisao.</span>
              )}
            </div>
          </div>
        </div>

        <aside className="min-w-0 space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
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
            <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <Label htmlFor="coverFile" className="text-zinc-300">
                Upload da capa (JPG, PNG, WEBP até 5MB)
              </Label>
              <Input
                id="coverFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="h-10 border-zinc-700 bg-zinc-950 text-zinc-100 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-2 file:py-1 file:text-xs file:text-zinc-200"
                onChange={(event) => void handleCoverUpload(event.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-zinc-400">{uploadingCover ? "Enviando capa..." : "Selecione um arquivo para enviar."}</p>
              {coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImageUrl}
                  alt="Preview da capa"
                  className="max-h-44 w-full rounded-md border border-zinc-800 object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-200">
              Data de publicacao (opcional)
            </Label>
            <DateTimePicker
              value={publishedAt}
              onChange={setPublishedAt}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-zinc-400">
              Rascunho local {persistedDraft ? "restaurado" : "ativo"} automaticamente neste navegador.
            </p>
            {mode === "edit" ? (
              <p className="text-xs text-zinc-400">
                Autosave remoto:{" "}
                {autosaveState === "saving"
                  ? "salvando..."
                  : autosaveState === "saved"
                    ? "salvo"
                    : autosaveState === "error"
                      ? "erro"
                      : "aguardando"}
              </p>
            ) : null}
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
              <Button
                type="button"
                variant="ghost"
                className="h-10 text-zinc-300 sm:col-span-2"
                onClick={() => handleProtectedNavigation("/admin/posts")}
              >
                Cancelar e voltar
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
