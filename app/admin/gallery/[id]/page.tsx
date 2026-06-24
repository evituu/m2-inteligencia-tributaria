"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell } from "../../_components/AdminShell";

type AdminPhoto = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number;
};

type AdminAlbumDetail = {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  coverImage: string | null;
  photos: AdminPhoto[];
};

// 4 MB per HTTP request — safely under Next.js's 10 MB body limit
const CHUNK_BYTES = 4 * 1024 * 1024;
// How many files upload concurrently
const CONCURRENT_FILES = 3;

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

/** Generate a simple unique id without crypto.randomUUID (browser-safe) */
function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Upload a single file in ≤4 MB chunks.
 * Returns the created photo record on success, null on failure.
 */
async function uploadFileChunked(
  file: File,
  albumId: string,
  csrfToken: string,
): Promise<{ id: string; url: string; order: number } | null> {
  const uploadId = uid();
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_BYTES));

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_BYTES;
    const end = Math.min(start + CHUNK_BYTES, file.size);
    const chunk = file.slice(start, end);

    let res: Response;
    try {
      res = await fetch(`/api/admin/gallery/albums/${albumId}/photos/upload-chunk`, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          "x-upload-id": uploadId,
          "x-chunk-index": String(i),
          "x-total-chunks": String(totalChunks),
          "x-mime-type": file.type || "image/jpeg",
          "x-total-size": String(file.size),
          "content-type": "application/octet-stream",
        },
        body: chunk,
      });
    } catch {
      console.error(`[upload] network error on ${file.name} chunk ${i}`);
      return null;
    }

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      console.error(`[upload] chunk ${i} of ${file.name} → ${res.status}`, body?.message);
      return null;
    }

    // Last chunk returns the created photo
    if (i === totalChunks - 1) {
      const body = (await res.json()) as { item: { id: string; url: string; order: number } };
      return body.item;
    }
  }
  return null;
}

export default function AdminGalleryAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AdminAlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadAlbum() {
    setLoading(true);
    const res = await fetch(`/api/admin/gallery/albums/${id}`);
    if (!res.ok) { setLoading(false); return; }
    const data = (await res.json()) as AdminAlbumDetail;
    setAlbum(data);
    setLoading(false);
  }

  useEffect(() => { void loadAlbum(); }, [id]);

  async function handleUpload() {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploading(true);
    setUploadProgress({ done: 0, total: fileArray.length });

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setUploading(false);
      setUploadProgress(null);
      toast.error("Falha de CSRF. Recarregue a página.");
      return;
    }

    let doneCount = 0;
    let createdCount = 0;
    let failedCount = 0;

    // Upload CONCURRENT_FILES at a time; each file uploads its chunks sequentially
    for (let i = 0; i < fileArray.length; i += CONCURRENT_FILES) {
      const batch = fileArray.slice(i, i + CONCURRENT_FILES);
      const results = await Promise.all(
        batch.map((file) => uploadFileChunked(file, id, csrfToken)),
      );
      for (const r of results) {
        if (r) createdCount++;
        else failedCount++;
      }
      doneCount += batch.length;
      setUploadProgress({ done: doneCount, total: fileArray.length });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedCount(0);
    setUploading(false);
    setUploadProgress(null);

    if (failedCount === 0) {
      toast.success(`${createdCount} foto${createdCount !== 1 ? "s" : ""} enviada${createdCount !== 1 ? "s" : ""} com sucesso.`);
    } else {
      if (createdCount > 0) {
        toast.success(`${createdCount} foto${createdCount !== 1 ? "s" : ""} enviada${createdCount !== 1 ? "s" : ""} com sucesso.`);
      }
      toast.warning(`${failedCount} arquivo${failedCount !== 1 ? "s" : ""} não pôde${failedCount !== 1 ? "ram" : ""} ser processado${failedCount !== 1 ? "s" : ""}.`);
    }

    await loadAlbum();
  }

  async function handleReorder(photoAId: string, photoBId: string, orderA: number, orderB: number) {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) { toast.error("Falha de CSRF. Recarregue a página."); return; }

    const [resA, resB] = await Promise.all([
      fetch(`/api/admin/gallery/photos/${photoAId}`, {
        method: "PATCH",
        headers: { "x-csrf-token": csrfToken, "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderB }),
      }),
      fetch(`/api/admin/gallery/photos/${photoBId}`, {
        method: "PATCH",
        headers: { "x-csrf-token": csrfToken, "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderA }),
      }),
    ]);

    if (!resA.ok || !resB.ok) { toast.error("Falha ao reordenar fotos."); return; }
    await loadAlbum();
  }

  async function handleSetCover(photoUrl: string) {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) { toast.error("Falha de CSRF. Recarregue a página."); return; }

    const res = await fetch(`/api/admin/gallery/albums/${id}`, {
      method: "PATCH",
      headers: { "x-csrf-token": csrfToken, "Content-Type": "application/json" },
      body: JSON.stringify({ coverImage: photoUrl }),
    });

    if (!res.ok) { toast.error("Falha ao definir capa."); return; }
    toast.success("Capa do álbum atualizada.");
    await loadAlbum();
  }

  async function handleDeletePhoto(photoId: string) {
    if (!window.confirm("Excluir esta foto permanentemente?")) return;

    const csrfToken = await getCsrfToken();
    const res = await fetch(`/api/admin/gallery/photos/${photoId}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!res.ok && res.status !== 204) { toast.error("Falha ao excluir foto."); return; }
    toast.success("Foto excluída.");
    await loadAlbum();
  }

  if (loading) {
    return (
      <AdminShell title="Álbum">
        <p className="text-sm text-zinc-400">Carregando...</p>
      </AdminShell>
    );
  }

  if (!album) {
    return (
      <AdminShell title="Álbum não encontrado">
        <p className="text-sm text-zinc-400">
          Este álbum não existe ou foi excluído.{" "}
          <button type="button" onClick={() => router.push("/admin/gallery")} className="text-[#f2c40f] underline">
            Voltar para galeria
          </button>
        </p>
      </AdminShell>
    );
  }

  const pct = uploadProgress ? Math.round((uploadProgress.done / uploadProgress.total) * 100) : 0;

  return (
    <AdminShell
      title={album.title}
      subtitle={`${album.photos.length} foto${album.photos.length !== 1 ? "s" : ""} · ${album.isPublic ? "Público" : "Oculto"}`}
    >
      {/* Upload panel */}
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Enviar fotos</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Selecione quantas fotos quiser (JPG, PNG, WEBP, até 100 MB cada). Convertidas automaticamente para WebP.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(e) => setSelectedCount(e.target.files?.length ?? 0)}
            className="text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:text-zinc-200 file:cursor-pointer disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={uploading || selectedCount === 0}
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#f2c40f] px-5 text-sm font-semibold text-[#12151b] disabled:opacity-60"
          >
            {uploading && uploadProgress
              ? `Enviando ${uploadProgress.done} de ${uploadProgress.total}…`
              : selectedCount > 0
                ? `Enviar ${selectedCount} foto${selectedCount !== 1 ? "s" : ""}`
                : "Enviar fotos"}
          </button>
        </div>

        {uploading && uploadProgress && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#f2c40f] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">{pct}% concluído</p>
          </div>
        )}
      </section>

      {/* Photo grid */}
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Fotos ({album.photos.length})</h2>

        {album.photos.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">
            Nenhuma foto neste álbum. Use o formulário acima para enviar.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {album.photos.map((photo, index) => {
              const prevPhoto = album.photos[index - 1];
              const nextPhoto = album.photos[index + 1];
              const isCover = album.coverImage === photo.url;

              return (
                <div key={photo.id} className="group relative">
                  <div className={`aspect-square overflow-hidden rounded-lg border bg-zinc-800 ${isCover ? "border-[#f2c40f]" : "border-zinc-700"}`}>
                    <Image
                      src={photo.url}
                      alt={photo.alt ?? photo.caption ?? "Foto do álbum"}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                    {isCover && (
                      <span className="absolute left-1 top-1 rounded bg-[#f2c40f] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#12151b]">
                        Capa
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleDeletePhoto(photo.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-900/90 text-sm font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Excluir foto"
                  >
                    ×
                  </button>

                  <div className="mt-1 flex gap-1">
                    <button
                      type="button"
                      onClick={() => void handleReorder(photo.id, prevPhoto.id, photo.order, prevPhoto.order)}
                      disabled={index === 0}
                      className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-300 disabled:opacity-30"
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleReorder(photo.id, nextPhoto.id, photo.order, nextPhoto.order)}
                      disabled={index === album.photos.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-300 disabled:opacity-30"
                      aria-label="Mover para baixo"
                    >
                      ↓
                    </button>
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => void handleSetCover(photo.url)}
                        className="flex h-6 flex-1 items-center justify-center rounded bg-zinc-800 text-[10px] text-zinc-400 hover:bg-[#c9a84c]/20 hover:text-[#f2c40f]"
                        aria-label="Definir como capa"
                        title="Definir como capa"
                      >
                        ☆ capa
                      </button>
                    )}
                  </div>

                  {photo.caption && (
                    <p className="mt-1 truncate text-xs text-zinc-400">{photo.caption}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
