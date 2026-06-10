import { prisma } from "@/lib/server/db";
import type { AlbumPhoto, GalleryAlbum } from "@/data/gallery";

const DEFAULT_COVER = "/imagens/office/fachada_m2.webp";

function mapAlbum(album: {
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  eventDate: string | null;
  location: string | null;
}): GalleryAlbum {
  return {
    slug: album.slug,
    title: album.title,
    description: album.description ?? "",
    coverImage: album.coverImage ?? DEFAULT_COVER,
    eventDate: album.eventDate ?? "",
    location: album.location ?? "",
    imageFolder: "",
  };
}

export async function getAllPublicAlbums(): Promise<GalleryAlbum[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublic: true },
    orderBy: { order: "asc" },
  });

  return albums.map(mapAlbum);
}

export async function getPublicAlbumBySlug(
  slug: string,
): Promise<{ album: GalleryAlbum; photos: AlbumPhoto[] } | null> {
  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, isPublic: true },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });

  if (!album) return null;

  const photos: AlbumPhoto[] = album.photos.map((photo, index) => ({
    src: photo.url,
    alt: photo.alt ?? `${album.title} — foto ${index + 1}`,
    caption: photo.caption ?? undefined,
  }));

  return { album: mapAlbum(album), photos };
}

export async function getOtherPublicAlbums(
  excludeSlug: string,
  limit = 3,
): Promise<GalleryAlbum[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublic: true, slug: { not: excludeSlug } },
    orderBy: { order: "asc" },
    take: limit,
  });

  return albums.map(mapAlbum);
}
