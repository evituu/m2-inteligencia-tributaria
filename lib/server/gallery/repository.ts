import { prisma } from "@/lib/server/db";
import type { AlbumPhoto, AlbumPhotoLayout, GalleryAlbum } from "@/app/galeria-m2/_lib/albums";
import { GALLERY_ALBUMS, getAlbumPhotos as getStaticAlbumPhotos } from "@/app/galeria-m2/_lib/albums";

function mapDbAlbum(album: {
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  eventDate: string | null;
  location: string | null;
}): GalleryAlbum {
  return {
    slug: album.slug,
    title: album.title,
    description: album.description,
    coverImage: album.coverImageUrl,
    eventDate: album.eventDate ?? "",
    location: album.location ?? "",
  };
}

function resolvePhotoLayout(index: number, total: number): AlbumPhotoLayout {
  if (total >= 6 && index === 2) return "featured";
  if (total >= 6 && index === 5) return "wide";
  return "default";
}

export async function getPublishedAlbumsFromDb(): Promise<GalleryAlbum[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      slug: true,
      title: true,
      description: true,
      coverImageUrl: true,
      eventDate: true,
      location: true,
    },
  });

  return albums.map(mapDbAlbum);
}

export async function getAllAlbumsForPublic(): Promise<GalleryAlbum[]> {
  const dbAlbums = await getPublishedAlbumsFromDb();
  if (dbAlbums.length > 0) return dbAlbums;
  return GALLERY_ALBUMS;
}

export async function getAlbumBySlugForPublic(slug: string): Promise<GalleryAlbum | undefined> {
  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, isPublished: true },
    select: {
      slug: true,
      title: true,
      description: true,
      coverImageUrl: true,
      eventDate: true,
      location: true,
    },
  });

  if (album) return mapDbAlbum(album);
  return GALLERY_ALBUMS.find((item) => item.slug === slug);
}

export async function getAlbumPhotosForPublic(album: GalleryAlbum): Promise<AlbumPhoto[]> {
  const dbAlbum = await prisma.galleryAlbum.findUnique({
    where: { slug: album.slug },
    include: {
      photos: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (dbAlbum && dbAlbum.photos.length > 0) {
    const total = dbAlbum.photos.length;
    return dbAlbum.photos.map((photo, index) => ({
      src: photo.src,
      alt: photo.alt,
      layout: (photo.layout as AlbumPhotoLayout) || resolvePhotoLayout(index, total),
      caption: photo.caption ?? undefined,
    }));
  }

  const staticAlbum = GALLERY_ALBUMS.find((item) => item.slug === album.slug);
  if (staticAlbum) return getStaticAlbumPhotos(staticAlbum);
  return [];
}
