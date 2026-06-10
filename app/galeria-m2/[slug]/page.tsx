import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AlbumPhotoGrid } from "../_components/album-photo-grid";
import { HeroAlbum } from "../_components/hero-album";
import { AlbumRelatedAlbums } from "../_components/AlbumRelatedAlbums";
import { getPublicAlbumBySlug, getOtherPublicAlbums } from "../_lib/gallery";

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicAlbumBySlug(slug);
  if (!result) return { title: "Album não encontrado | M2" };
  return {
    title: `${result.album.title} | Galeria M2`,
    description: result.album.description,
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const result = await getPublicAlbumBySlug(slug);
  if (!result) notFound();

  const { album, photos } = result;
  const otherAlbums = await getOtherPublicAlbums(slug, 3);

  return (
    <main className="flex min-h-screen flex-col bg-[#05090c]">
      <NavigationMenu />
      <HeroAlbum album={album} />
      <section className="w-full px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-6xl pt-12 md:pt-16">
          <AlbumPhotoGrid photos={photos} />
        </div>
      </section>
      <AlbumRelatedAlbums albums={otherAlbums} />
      <Footer />
    </main>
  );
}
