import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AlbumPhotoGrid } from "../_components/album-photo-grid";
import { HeroAlbum } from "../_components/hero-album";
import { getAlbumBySlug, getAlbumPhotos } from "../_lib/albums";

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return { title: "Album nao encontrado | M2" };
  return { title: `${album.title} | Galeria M2`, description: album.description };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();
  const photos = getAlbumPhotos(album);

  return (
    <main className="flex min-h-screen flex-col bg-[#05090c]">
      <NavigationMenu />
      <HeroAlbum album={album} />
      <section className="w-full px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-6xl pt-12 md:pt-16">
          <AlbumPhotoGrid photos={photos} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
