"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "../_components/AdminShell";

type AdminAlbum = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string;
  _count: { photos: number };
};

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlbums() {
      setLoading(true);
      const response = await fetch("/api/admin/albums");
      if (!response.ok) {
        setError("Nao foi possivel carregar os albuns.");
        setLoading(false);
        return;
      }
      const data = (await response.json()) as { items: AdminAlbum[] };
      setAlbums(data.items ?? []);
      setLoading(false);
    }

    void loadAlbums();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#04070d]">
      <NavigationMenu />
      <div className="flex-1 pt-22">
        <AdminShell
          title="Galeria M2"
          subtitle="Gerencie albuns de eventos: titulo, banner e fotos."
          primaryAction={{ label: "Novo album", href: "/admin/albums/novo" }}
        >
          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
            {loading ? (
              <p className="text-sm text-zinc-400">Carregando albuns...</p>
            ) : albums.length === 0 ? (
              <p className="text-sm text-zinc-400">
                Nenhum album cadastrado. Crie o primeiro album de evento.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {albums.map((album) => (
                  <li key={album.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{album.title}</p>
                      <p className="text-xs text-zinc-400">
                        /galeria-m2/{album.slug} · {album._count.photos} foto(s) ·{" "}
                        {album.isPublished ? "Publicado" : "Rascunho"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/galeria-m2/${album.slug}`}
                        className="inline-flex h-9 items-center rounded-md border border-zinc-700 px-3 text-xs text-zinc-200 hover:bg-zinc-800"
                        target="_blank"
                      >
                        Ver no site
                      </Link>
                      <Link
                        href={`/admin/albums/${album.id}/editar`}
                        className="inline-flex h-9 items-center rounded-md bg-[#f2c40f] px-3 text-xs font-semibold text-[#12151b] hover:bg-[#e3b80d]"
                      >
                        Editar
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </AdminShell>
      </div>
      <Footer />
    </div>
  );
}
