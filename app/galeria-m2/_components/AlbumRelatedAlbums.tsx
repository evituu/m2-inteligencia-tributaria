import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GalleryAlbum } from "@/data/gallery";
import { GalleryAlbumCard } from "@/app/galeria-m2/_components/GalleryAlbumCard";

interface AlbumRelatedAlbumsProps {
  albums: GalleryAlbum[];
}

export function AlbumRelatedAlbums({ albums }: AlbumRelatedAlbumsProps) {
  if (albums.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-white/10 bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 block h-1 w-12 bg-[#f2c40f]" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-black md:text-3xl">
              Explore outros{" "}
              <span className="text-gold-gradient">álbuns</span>
            </h2>
            <p className="mt-2 text-sm leading-7 text-zinc-400 md:text-base">
              Continue conhecendo os momentos e bastidores da M2.
            </p>
          </div>
          <Link
            href="/galeria-m2"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#f2c40f] transition-colors hover:text-white"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <GalleryAlbumCard key={album.slug} album={album} />
          ))}
        </div>
      </div>
    </section>
  );
}
