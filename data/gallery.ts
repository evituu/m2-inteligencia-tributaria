export type AlbumPhotoLayout = "default" | "featured" | "wide";

export interface AlbumPhoto {
  src: string;
  alt: string;
  layout?: AlbumPhotoLayout;
  caption?: string;
}

export interface GalleryAlbum {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  eventDate: string;
  location: string;
  imageFolder: string;
}

const ALBUM_PHOTO_FILES = [
  "DSC05781.jpg",
  "IMG_4330.jpg",
  "DSC05735.jpg",
  "DSC04165.jpg",
  "DSC05727.jpg",
  "IMG_4347.jpg",
] as const;

export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    slug: "eventos-e-encontros",
    title: "Eventos e encontros",
    description:
      "Registros dos encontros, palestras e participações da M2 em eventos do setor tributário e corporativo.",
    coverImage: "/imagens/office/fachada_m2.webp",
    eventDate: "2024",
    location: "Fortaleza, CE",
    imageFolder: "m2-album-1",
  },
  {
    slug: "escritorio-m2",
    title: "Escritório M2",
    description:
      "O dia a dia no escritório: colaboração, precisão técnica e o ambiente onde a inteligência tributária da M2 acontece.",
    coverImage: "/imagens/office/m2_colaboradores_trabalhando.png",
    eventDate: "2024",
    location: "Fortaleza, CE",
    imageFolder: "m2-album-2",
  },
  {
    slug: "bastidores",
    title: "Bastidores",
    description:
      "Momentos de liderança, cultura e bastidores da equipe M2 em ação.",
    coverImage: "/imagens/office/m2_lideres_socios.png",
    eventDate: "2024",
    location: "Fortaleza, CE",
    imageFolder: "m2-album-3",
  },
];

export function getAllAlbums(): GalleryAlbum[] {
  return GALLERY_ALBUMS;
}

export function getAlbumBySlug(slug: string): GalleryAlbum | undefined {
  return GALLERY_ALBUMS.find((album) => album.slug === slug);
}

export function getOtherAlbums(
  excludeSlug: string,
  limit = 3,
): GalleryAlbum[] {
  return GALLERY_ALBUMS.filter((album) => album.slug !== excludeSlug).slice(
    0,
    limit,
  );
}

export function getAlbumPhotos(album: GalleryAlbum): AlbumPhoto[] {
  return ALBUM_PHOTO_FILES.map((file, index) => ({
    src: `/imagens/${album.imageFolder}/${file}`,
    alt: `${album.title} — foto ${index + 1}`,
    layout: index === 2 ? "featured" : index === 5 ? "wide" : "default",
    caption: index === 5 ? "Equipe M2" : undefined,
  }));
}
