import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import type { GalleryAlbum } from "@/data/gallery";

interface HeroAlbumProps {
  album: GalleryAlbum;
}

export function HeroAlbum({ album }: HeroAlbumProps) {
  return (
    <section className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-[#05090c] md:min-h-[600px]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('${album.coverImage}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-[#05090c]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05090c]/30 via-transparent to-[#05090c]/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-28 text-center md:px-8 md:py-36">
        <Link
          href="/galeria-m2"
          className="mb-10 inline-flex items-center gap-2 self-start text-sm font-semibold text-zinc-300 transition-colors hover:text-[#f2c40f] drop-shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a galeria
        </Link>

        <div className="mb-4 h-1 w-16 rounded-full bg-[#f2c40f] drop-shadow-lg" />

        <h1 className="text-3xl font-extrabold tracking-tight text-gold-gradient drop-shadow-lg md:text-5xl lg:text-6xl">
          {album.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white drop-shadow-md md:text-lg">
          {album.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#f2c40f] drop-shadow-md md:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {album.eventDate}
          </span>
          <span className="text-zinc-500">|</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {album.location}
          </span>
        </div>
      </div>
    </section>
  );
}
