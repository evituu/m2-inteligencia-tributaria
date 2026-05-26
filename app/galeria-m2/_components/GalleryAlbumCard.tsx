import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GalleryAlbum } from "@/data/gallery";

interface GalleryAlbumCardProps {
  album: GalleryAlbum;
}

export function GalleryAlbumCard({ album }: GalleryAlbumCardProps) {
  return (
    <Link
      href={`/galeria-m2/${album.slug}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c40f] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-200">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
          style={{ backgroundImage: `url('${album.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-[#f2c40f] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0a0f16] opacity-0 transition-all duration-300 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100">
            VER
          </span>
        </div>
        <div className="absolute inset-x-6 bottom-5">
          <h3 className="mt-1 text-xl font-semibold text-gold-gradient">
            {album.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
