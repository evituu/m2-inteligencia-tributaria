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
  photos: AdminPhoto[];
};

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

export default function AdminGalleryAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AdminAlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadAlbum() {
    setLoading(true);
    const res = await fetch(`/api/admin/gallery/albums/${id}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = (await res.json()) as AdminAlbumDetail;
    setAlbum(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadAlbum();
  }, [id]);

  async function handleUpload() {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setUploading(false);
      toast.error("Falha de CSRF. Recarregue a página.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const res = await fetch(`/api/admin/gallery/albums/${id}/photos`, {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      toast.error(body?.message ?? "Falha no upload.");
      return;
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Fotos enviadas com sucesso.");
    await loadAlbum();
  }

  async function handleReorder(
    photoAId: string,
    photoBId: string,
    orderA: number,
    orderB: number,
  ) {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      toast.error("Falha de CSRF. Recarregue a página.");
      return;
    }

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

    if (!resA.ok || !resB.ok) {
      toast.error("Falha ao reordenar fotos.");
      return;
    }

    await loadAlbum();
  }

  async function handleDeletePhoto(photoId: string) {
    if (!window.confirm("Excluir esta foto permanentemente?")) return;

    const csrfToken = await getCsrfToken();
    const res = await fetch(`/api/admin/gallery/photos/${photoId}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!res.ok && res.status !== 204) {
      toast.error("Falha ao excluir foto.");
      return;
    }

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
          <button
            type="button"
            onClick={() => router.push("/admin/gallery")}
            className="text-[#f2c40f] underline"
          >
            Voltar para galeria
          </button>
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={album.title}
      subtitle={`${album.photos.length} foto${album.photos.length !== 1 ? "s" : ""} · ${album.isPublic ? "Público" : "Oculto"}`}
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Enviar fotos</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Máximo 5 arquivos por vez, 5MB cada (JPG, PNG, WEBP).
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:text-zinc-200 file:cursor-pointer"
          />
          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={uploading}
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#f2c40f] px-5 text-sm font-semibold text-[#12151b] disabled:opacity-60"
          >
            {uploading ? "Enviando..." : "Enviar fotos"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">
          Fotos ({album.photos.length})
        </h2>

        {album.photos.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">
            Nenhuma foto neste álbum. Use o formulário acima para enviar.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {album.photos.map((photo, index) => {
              const prevPhoto = album.photos[index - 1];
              const nextPhoto = album.photos[index + 1];
              return (
                <div key={photo.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
                    <Image
                      src={photo.url}
                      alt={photo.alt ?? photo.caption ?? "Foto do álbum"}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
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
                      onClick={() =>
                        void handleReorder(photo.id, prevPhoto.id, photo.order, prevPhoto.order)
                      }
                      disabled={index === 0}
                      className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-300 disabled:opacity-30"
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void handleReorder(photo.id, nextPhoto.id, photo.order, nextPhoto.order)
                      }
                      disabled={index === album.photos.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-300 disabled:opacity-30"
                      aria-label="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                  {photo.caption ? (
                    <p className="mt-1 truncate text-xs text-zinc-400">{photo.caption}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
