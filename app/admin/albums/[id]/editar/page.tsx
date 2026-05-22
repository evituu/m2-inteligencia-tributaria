"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "../../../_components/AdminShell";
import { AlbumEditorForm, normalizeInitialAlbumData } from "../../../_components/AlbumEditorForm";

export default function AdminAlbumEditPage() {
  const params = useParams<{ id: string }>();
  const albumId = params.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<ReturnType<typeof normalizeInitialAlbumData> | null>(null);

  useEffect(() => {
    async function loadAlbum() {
      setLoading(true);
      const response = await fetch(`/api/admin/albums/${albumId}`);
      if (!response.ok) {
        setError("Album nao encontrado.");
        setLoading(false);
        return;
      }

      const album = (await response.json()) as {
        id: string;
        title: string;
        slug: string;
        description: string;
        coverImageUrl: string;
        eventDate: string | null;
        location: string | null;
        isPublished: boolean;
        photos: { id: string; src: string; alt: string }[];
      };

      setInitialData(
        normalizeInitialAlbumData({
          id: album.id,
          title: album.title,
          slug: album.slug,
          description: album.description,
          coverImageUrl: album.coverImageUrl,
          eventDate: album.eventDate,
          location: album.location,
          isPublished: album.isPublished,
          photos: album.photos,
        }),
      );
      setLoading(false);
    }

    if (albumId) void loadAlbum();
  }, [albumId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#04070d]">
      <NavigationMenu />
      <div className="flex-1 pt-22">
        <AdminShell title="Editar album" subtitle="Atualize dados, banner e fotos do evento.">
          {loading ? <p className="text-sm text-zinc-400">Carregando album...</p> : null}
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {!loading && initialData ? <AlbumEditorForm mode="edit" initialData={initialData} /> : null}
        </AdminShell>
      </div>
      <Footer />
    </div>
  );
}
