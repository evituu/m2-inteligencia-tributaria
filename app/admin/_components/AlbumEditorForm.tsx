"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AlbumPhotoItem = {
  id: string;
  src: string;
  alt: string;
};

type InitialAlbumData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  eventDate: string;
  location: string;
  isPublished: boolean;
  photos?: AlbumPhotoItem[];
};

type AlbumEditorFormProps = {
  mode: "create" | "edit";
  initialData?: InitialAlbumData;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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

export function AlbumEditorForm({ mode, initialData }: AlbumEditorFormProps) {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? "");
  const [eventDate, setEventDate] = useState(initialData?.eventDate ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [photos, setPhotos] = useState<AlbumPhotoItem[]>(initialData?.photos ?? []);
  const [manualSlug, setManualSlug] = useState(Boolean(initialData?.slug?.trim()));
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [pendingPhotoFiles, setPendingPhotoFiles] = useState<File[]>([]);
  const [pendingZipFile, setPendingZipFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const albumId = initialData?.id;
  const canSubmit = useMemo(
    () => title.trim().length >= 3 && slug.trim().length >= 3 && coverImageUrl.trim().length > 0,
    [title, slug, coverImageUrl],
  );

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!manualSlug) setSlug(slugify(value));
  }

  function handleSlugChange(value: string) {
    setManualSlug(true);
    setSlug(slugify(value));
  }

  async function handleCoverUpload(file: File | null) {
    if (!file || uploadingCover) return;

    setUploadingCover(true);
    setError(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setUploadingCover(false);
      setError("Nao foi possivel validar CSRF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads/gallery-cover", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: formData,
    });

    setUploadingCover(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "Nao foi possivel enviar o banner.");
      return;
    }

    const data = (await response.json()) as { url: string };
    setCoverImageUrl(data.url);
    setSuccess("Banner do album enviado.");
  }

  async function uploadPhotosToAlbum(targetAlbumId: string) {
    if (pendingPhotoFiles.length === 0 && !pendingZipFile) return { uploaded: 0 };

    const csrfToken = await getCsrfToken();
    if (!csrfToken) throw new Error("Nao foi possivel validar CSRF.");

    const formData = new FormData();
    pendingPhotoFiles.forEach((file) => formData.append("files", file));
    if (pendingZipFile) formData.append("zip", pendingZipFile);

    const response = await fetch(`/api/admin/albums/${targetAlbumId}/photos`, {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: formData,
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(body?.message || "Nao foi possivel enviar as fotos.");
    }

    const data = (await response.json()) as {
      items: AlbumPhotoItem[];
      uploaded: number;
      errors?: string[];
    };

    if (data.errors?.length) {
      setError(data.errors.join(" "));
    }

    setPendingPhotoFiles([]);
    setPendingZipFile(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (zipInputRef.current) zipInputRef.current.value = "";

    return data;
  }

  async function handleUploadMorePhotos() {
    if (!albumId || uploadingPhotos) return;
    if (pendingPhotoFiles.length === 0 && !pendingZipFile) {
      setError("Selecione fotos ou um arquivo ZIP.");
      return;
    }

    setUploadingPhotos(true);
    setError(null);

    try {
      const data = await uploadPhotosToAlbum(albumId);
      setPhotos((current) => [...current, ...(data.items ?? [])]);
      setSuccess(`${data.uploaded} foto(s) adicionada(s).`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Erro no upload.");
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function handleDeletePhoto(photoId: string) {
    if (!albumId) return;

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setError("Nao foi possivel validar CSRF.");
      return;
    }

    const response = await fetch(`/api/admin/albums/${albumId}/photos?photoId=${photoId}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!response.ok) {
      setError("Nao foi possivel remover a foto.");
      return;
    }

    setPhotos((current) => current.filter((photo) => photo.id !== photoId));
    setSuccess("Foto removida.");
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setSubmitting(false);
      setError("Nao foi possivel validar CSRF.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      coverImageUrl: coverImageUrl.trim(),
      eventDate: eventDate.trim() || undefined,
      location: location.trim() || undefined,
      isPublished,
    };

    const endpoint =
      mode === "create" ? "/api/admin/albums" : `/api/admin/albums/${albumId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setSubmitting(false);
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "Nao foi possivel salvar o album.");
      return;
    }

    const saved = (await response.json()) as { id: string };
    const targetId = mode === "create" ? saved.id : albumId!;

    if (pendingPhotoFiles.length > 0 || pendingZipFile) {
      setUploadingPhotos(true);
      try {
        const uploadResult = await uploadPhotosToAlbum(targetId);
        if (mode === "edit") {
          setPhotos((current) => [...current, ...(uploadResult.items ?? [])]);
        }
      } catch (uploadError) {
        setSubmitting(false);
        setUploadingPhotos(false);
        setError(
          uploadError instanceof Error
            ? `${uploadError.message} O album foi salvo; envie as fotos na edicao.`
            : "Album salvo, mas as fotos falharam.",
        );
        router.push(`/admin/albums/${targetId}/editar`);
        return;
      }
      setUploadingPhotos(false);
    }

    setSubmitting(false);
    setSuccess(mode === "create" ? "Album criado com sucesso." : "Album atualizado.");
    router.push(`/admin/albums/${targetId}/editar`);
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="album-title" className="text-zinc-200">
              Titulo do album
            </Label>
            <Input
              id="album-title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Ex.: Congresso tributario 2025"
              className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-slug" className="text-zinc-200">
              Slug (URL)
            </Label>
            <Input
              id="album-slug"
              value={slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="congresso-tributario-2025"
              className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album-description" className="text-zinc-200">
              Descricao do evento
            </Label>
            <Textarea
              id="album-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descreva o evento e o contexto das fotos..."
              className="min-h-28 border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="album-event-date" className="text-zinc-200">
                Data (ex.: 2025 ou 15/03/2025)
              </Label>
              <Input
                id="album-event-date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album-location" className="text-zinc-200">
                Local
              </Label>
              <Input
                id="album-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Fortaleza, CE"
                className="h-10 border-zinc-700 bg-zinc-900 text-zinc-100"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div className="space-y-2">
            <Label className="text-zinc-200">Banner do album (capa)</Label>
            <p className="text-xs text-zinc-400">Uma unica imagem para o hero da pagina do album.</p>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="h-10 border-zinc-700 bg-zinc-950 text-zinc-100 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-2 file:py-1 file:text-xs file:text-zinc-200"
              onChange={(event) => void handleCoverUpload(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-zinc-400">
              {uploadingCover ? "Enviando banner..." : "JPG, PNG ou WEBP ate 5MB."}
            </p>
            {coverImageUrl ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-zinc-800">
                <Image src={coverImageUrl} alt="Preview do banner" fill className="object-cover" />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-200">Fotos do album</Label>
            <p className="text-xs text-zinc-400">
              Selecione varias imagens ou envie um ZIP com as fotos (ate 50 imagens, 5MB cada).
            </p>
            <Input
              ref={photoInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="h-10 border-zinc-700 bg-zinc-950 text-zinc-100 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-2 file:py-1 file:text-xs file:text-zinc-200"
              onChange={(event) => setPendingPhotoFiles(Array.from(event.target.files ?? []))}
            />
            <Input
              ref={zipInputRef}
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              className="h-10 border-zinc-700 bg-zinc-950 text-zinc-100 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-2 file:py-1 file:text-xs file:text-zinc-200"
              onChange={(event) => setPendingZipFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-zinc-500">
              {pendingPhotoFiles.length > 0
                ? `${pendingPhotoFiles.length} foto(s) selecionada(s).`
                : "Nenhuma foto selecionada."}
              {pendingZipFile ? ` ZIP: ${pendingZipFile.name}.` : ""}
            </p>
            {mode === "edit" && albumId ? (
              <Button
                type="button"
                onClick={() => void handleUploadMorePhotos()}
                disabled={uploadingPhotos}
                className="h-10 w-full bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
              >
                {uploadingPhotos ? "Enviando fotos..." : "Adicionar fotos ao album"}
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="album-published"
              type="checkbox"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
              className="h-4 w-4 rounded border-zinc-600"
            />
            <Label htmlFor="album-published" className="text-sm text-zinc-200">
              Publicar na galeria do site
            </Label>
          </div>

          {photos.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Fotos no album ({photos.length})
              </p>
              <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md border border-zinc-800">
                    <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="120px" />
                    {mode === "edit" ? (
                      <button
                        type="button"
                        onClick={() => void handleDeletePhoto(photo.id)}
                        className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-red-300"
                      >
                        Remover
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit || submitting || uploadingPhotos}
            className="h-10 w-full bg-[#f2c40f] text-[#12151b] hover:bg-[#e3b80d]"
          >
            {submitting ? "Salvando..." : mode === "create" ? "Criar album" : "Salvar album"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full text-zinc-300"
            onClick={() => router.push("/admin/albums")}
          >
            Voltar para lista
          </Button>
        </aside>
      </div>
    </section>
  );
}

export function normalizeInitialAlbumData(raw: {
  id?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  coverImageUrl?: string;
  eventDate?: string | null;
  location?: string | null;
  isPublished?: boolean;
  photos?: AlbumPhotoItem[];
}): InitialAlbumData {
  return {
    id: raw.id,
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    description: raw.description ?? "",
    coverImageUrl: raw.coverImageUrl ?? "",
    eventDate: raw.eventDate ?? "",
    location: raw.location ?? "",
    isPublished: raw.isPublished ?? true,
    photos: raw.photos ?? [],
  };
}
