"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "../_components/AdminShell";

type AdminAlbum = {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  order: number;
  _count: { photos: number };
};

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAlbums() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery/albums");
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { items: AdminAlbum[] };
    setAlbums(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadAlbums();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Excluir o álbum "${title}" e todas as suas fotos? Esta ação não pode ser desfeita.`)) {
      return;
    }

    const csrfToken = await getCsrfToken();
    const res = await fetch(`/api/admin/gallery/albums/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!res.ok && res.status !== 204) {
      toast.error("Falha ao excluir álbum.");
      return;
    }

    toast.success("Álbum excluído com sucesso.");
    await loadAlbums();
  }

  return (
    <AdminShell
      title="Galeria"
      subtitle="Gerencie álbuns e fotos."
      primaryAction={{ label: "Novo álbum", href: "/admin/gallery/novo" }}
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Álbuns</h2>

        {loading ? <p className="mt-4 text-sm text-zinc-400">Carregando...</p> : null}

        {!loading && albums.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">Nenhum álbum criado ainda.</p>
        ) : null}

        {!loading && albums.length > 0 ? (
          <div className="mt-4 space-y-3">
            {albums.map((album) => (
              <article
                key={album.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{album.title}</p>
                    <p className="text-xs text-zinc-400">
                      /{album.slug} ·{" "}
                      {album._count.photos} foto{album._count.photos !== 1 ? "s" : ""} ·{" "}
                      {album.isPublic ? "Público" : "Oculto"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/gallery/${album.id}`}
                      className="inline-flex h-8 items-center rounded-md border border-[#c9a84c]/40 bg-[#c9a84c]/15 px-3 text-xs font-semibold text-[#f2c40f]"
                    >
                      Fotos
                    </Link>
                    <Link
                      href={`/admin/gallery/${album.id}/editar`}
                      className="inline-flex h-8 items-center rounded-md border border-zinc-700 bg-zinc-800 px-3 text-xs font-semibold text-zinc-200"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(album.id, album.title)}
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
