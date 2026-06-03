"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AlbumPhoto } from "@/data/gallery";

interface AlbumPhotoLightboxProps {
  photos: AlbumPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export function AlbumPhotoLightbox({
  photos,
  initialIndex,
  onClose,
}: AlbumPhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const total = photos.length;
  const current = photos[index];

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada da foto"
      onClick={onClose}
    >
      {/* Topo: fechar + contador */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 md:text-sm">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[#f2c40f]/60 hover:bg-[#f2c40f]/10 hover:text-[#f2c40f]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Anterior */}
      {total > 1 ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          aria-label="Foto anterior"
          className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:scale-105 hover:border-[#f2c40f]/60 hover:bg-[#f2c40f]/10 hover:text-[#f2c40f] md:left-6 md:h-14 md:w-14"
        >
          <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
        </button>
      ) : null}

      {/* Imagem */}
      <div
        className="relative mx-14 flex max-h-[80vh] max-w-[min(92vw,1100px)] items-center justify-center md:mx-24"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={1400}
          height={900}
          className="max-h-[80vh] w-auto max-w-full object-contain shadow-2xl shadow-black/50"
          priority
        />
        {current.caption ? (
          <p className="absolute -bottom-10 left-0 right-0 text-center text-sm font-medium text-zinc-300 md:text-base">
            {current.caption}
          </p>
        ) : null}
      </div>

      {/* Próxima */}
      {total > 1 ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          aria-label="Próxima foto"
          className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:scale-105 hover:border-[#f2c40f]/60 hover:bg-[#f2c40f]/10 hover:text-[#f2c40f] md:right-6 md:h-14 md:w-14"
        >
          <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
        </button>
      ) : null}
    </div>
  );
}
