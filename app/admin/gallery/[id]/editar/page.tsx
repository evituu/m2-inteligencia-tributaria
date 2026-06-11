"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AdminShell } from "../../../_components/AdminShell";

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

type AlbumData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventDate: string | null;
  location: string | null;
  isPublic: boolean;
};

export default function EditAlbumPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [manualSlug, setManualSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadAlbum() {
      const res = await fetch(`/api/admin/gallery/albums/${id}`);
      if (!res.ok) {
        setLoadError("Não foi possível carregar o álbum.");
        return;
      }
      const album = (await res.json()) as AlbumData;
      setTitle(album.title);
      setSlug(album.slug);
      setDescription(album.description ?? "");
      setEventDate(album.eventDate ?? "");
      setLocation(album.location ?? "");
      setIsPublic(album.isPublic);
      setLoaded(true);
    }

    void loadAlbum();
  }, [id]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!manualSlug) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setSaving(false);
      setError("Falha de CSRF. Recarregue a página.");
      return;
    }

    const res = await fetch(`/api/admin/gallery/albums/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        eventDate: eventDate.trim() || undefined,
        location: location.trim() || undefined,
        isPublic,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      const errorMessage = body?.message ?? "Falha ao salvar álbum.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    toast.success("Álbum atualizado.");
    router.push("/admin/gallery");
  }

  return (
    <AdminShell title="Editar álbum">
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        {loadError ? (
          <p className="text-sm text-red-400">{loadError}</p>
        ) : !loaded ? (
          <p className="text-sm text-zinc-400">Carregando...</p>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 max-w-lg">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200" htmlFor="title">
                Título *
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200" htmlFor="slug">
                Slug *
              </label>
              <input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setManualSlug(true);
                  setSlug(slugify(e.target.value));
                }}
                required
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-200" htmlFor="eventDate">
                  Data do evento
                </label>
                <input
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="ex: Janeiro 2025"
                  className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-200" htmlFor="location">
                  Localização
                </label>
                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ex: Fortaleza, CE"
                  className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              Álbum público (visível no site)
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-6 text-sm font-semibold text-[#12151b] disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
              <Link
                href={`/admin/gallery/${id}`}
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Fotos do álbum
              </Link>
            </div>
          </form>
        )}
      </section>
    </AdminShell>
  );
}
