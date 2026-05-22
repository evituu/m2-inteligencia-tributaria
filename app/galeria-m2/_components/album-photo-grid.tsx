import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { AlbumPhoto, AlbumPhotoLayout } from "../_lib/albums";

function layoutClasses(layout: AlbumPhotoLayout = "default"): string {
  switch (layout) {
    case "featured":
      return "md:col-span-2 lg:col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto lg:min-h-full";
    case "wide":
      return "md:col-span-2 lg:col-span-3 aspect-[16/9]";
    default:
      return "aspect-[4/3]";
  }
}

interface AlbumPhotoGridProps {
  photos: AlbumPhoto[];
}

export function AlbumPhotoGrid({ photos }: AlbumPhotoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <div
          key={`${photo.src}-${index}`}
          className={`group relative cursor-pointer overflow-hidden rounded-sm border border-zinc-700/40 bg-zinc-900 ${layoutClasses(photo.layout)}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 scale-95 border-2 border-[#e9c349] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
          <div
            className={`absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${
              photo.caption ? "bottom-6 left-6 right-6 flex items-center justify-between" : ""
            }`}
          >
            {photo.caption ? (
              <span className="text-lg font-semibold text-white">{photo.caption}</span>
            ) : null}
            <ZoomIn className="h-5 w-5 text-[#e9c349]" aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}
