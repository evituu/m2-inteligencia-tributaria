/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Calendar, 
  MapPin, 
  User, 
  Camera,
  Maximize,
  Minimize,
  Info 
} from "lucide-react";
import { Photo } from "../types";

interface LightboxProps {
  photos: Photo[];
  initialPhotoId: string;
  onClose: () => void;
  albumTitle: string;
}

export default function Lightbox({ photos, initialPhotoId, onClose, albumTitle }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find initial index
  useEffect(() => {
    const foundIndex = photos.findIndex((p) => p.id === initialPhotoId);
    if (foundIndex !== -1) {
      setCurrentIndex(foundIndex);
    }
  }, [initialPhotoId, photos]);

  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [currentIndex, photos.length]);

  // Slideshow play/pause handler
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        handleNext();
      }, 4000); // changes slide every 4 seconds
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, currentIndex]);

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0d0d]/98 backdrop-blur-md flex flex-col justify-between select-none animate-fade-in" id="lightbox-container">
      {/* Upper Status / Header bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent text-white z-10">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs tracking-widest text-[#C5A059] uppercase font-bold">
            Mostrando Álbum
          </span>
          <h2 className="text-sm md:text-base font-semibold truncate max-w-[200px] sm:max-w-md">
            {albumTitle}
          </h2>
        </div>

        {/* Counter and status in Mono design */}
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded-sm border border-stone-800">
          <Camera size={13} className="text-[#C5A059]" />
          <span>FOTO</span>
          <span className="text-white font-bold">{currentIndex + 1}</span>
          <span>/</span>
          <span>{photos.length}</span>
        </div>

        {/* Control actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Pause-Play controller */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-semibold px-3 ${
              isPlaying ? "bg-[#C5A059]/20 text-[#C5A059]" : "bg-stone-900/40"
            }`}
            title={isPlaying ? "Pausar Slideshow" : "Iniciar Slideshow Automático"}
            id="lightbox-btn-slideshow"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="hidden md:inline">{isPlaying ? "PAUSAR" : "SLIDESHOW"}</span>
          </button>

          {/* Info toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`p-2 rounded-full hover:bg-stone-800 transition-all ${
              showDetails ? "text-[#C5A059] bg-[#C5A059]/10" : "text-stone-300"
            }`}
            title="Detalhes da Imagem"
            id="lightbox-btn-details"
          >
            <Info size={18} />
          </button>

          {/* Zoom toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className={`p-2 rounded-full hover:bg-stone-800 transition-all ${
              isZoomed ? "text-[#C5A059] bg-[#C5A059]/10" : "text-stone-300"
            }`}
            title={isZoomed ? "Menos Zoom" : "Mais Zoom"}
            id="lightbox-btn-zoom"
          >
            {isZoomed ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          <div className="h-6 w-[1px] bg-stone-800"></div>

          {/* Close main */}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-300 hover:text-[#C5A059] hover:bg-stone-800 transition-all cursor-pointer"
            title="Fechar Visualizador (Esc)"
            id="lightbox-btn-close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main image content area */}
      <div className="relative flex-grow flex items-center justify-between px-3 md:px-12 py-2 overflow-hidden">
        {/* Previous Button desktop/tablet */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-20 p-2.5 md:p-4 rounded-full bg-stone-900/40 text-stone-300 hover:text-white hover:bg-stone-800 hover:border-[#C5A059]/60 border border-transparent transition-all cursor-pointer shadow-lg"
          title="Foto Anterior (Seta Esquerda)"
          id="lightbox-btn-prev"
        >
          <ChevronLeft size={24} />
        </button>

        {/* The Image Viewport */}
        <div 
          className="w-full h-full flex flex-col items-center justify-center relative touch-none transition-all duration-300"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <div 
            className={`transition-all duration-300 ease-out flex items-center justify-center ${
              isZoomed ? "scale-130 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            } max-w-full max-h-[80vh] md:max-h-[85vh] drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]`}
          >
            <img
              src={currentPhoto.url}
              alt={currentPhoto.alt}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-sm select-none border border-stone-800 pointer-events-none"
            />
          </div>
        </div>

        {/* Next Button desktop/tablet */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-20 p-2.5 md:p-4 rounded-full bg-stone-900/40 text-stone-300 hover:text-white hover:bg-stone-800 hover:border-[#C5A059]/60 border border-transparent transition-all cursor-pointer shadow-lg"
          title="Seguinte Foto (Seta Direita)"
          id="lightbox-btn-next"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide descriptive Details Drawer & Thumbnails Panel */}
      <div className="z-10 bg-gradient-to-t from-black via-black/95 to-black/20 pb-4 pt-8 shrink-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Caption and Meta Information */}
          {showDetails && (
            <div className="mb-6 border-b border-stone-800/80 pb-5 text-stone-300 animate-slide-up bg-stone-950/60 p-4 rounded border border-stone-900/50 backdrop-blur-sm">
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-2">
                <span className="text-[10px] md:text-xs font-mono text-[#C5A059] uppercase tracking-wider bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20 font-bold">
                  {currentPhoto.category === "sede" ? "Sede Corporativa" : 
                   currentPhoto.category === "conferencia" ? "Conferência" : 
                   currentPhoto.category === "teambuilding" ? "Team Building" : "Bastidores"}
                </span>
                
                <span className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                  <Calendar size={12} className="text-[#C5A059]" />
                  {currentPhoto.date}
                </span>

                <span className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                  <MapPin size={12} className="text-[#C5A059]" />
                  {currentPhoto.location}
                </span>

                {currentPhoto.photographer && (
                  <span className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                    <User size={12} className="text-[#C5A059]" />
                    Foto: {currentPhoto.photographer}
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-light mt-2 max-w-4xl">
                {currentPhoto.caption}
              </p>
            </div>
          )}

          {/* Quick thumbnail navigation strip */}
          <div className="flex items-center justify-between gap-4">
            <span className="hidden lg:block text-[10px] tracking-widest text-[#C5A059] uppercase font-bold shrink-0">
              Mavegação Rápida
            </span>

            {/* Thumbnail cards strip with custom scrollbar hides */}
            <div className="flex-grow flex gap-2.5 overflow-x-auto py-2 px-1 justify-start md:justify-center scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
              {photos.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsZoomed(false);
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden shrink-0 transition-all duration-200 border-2 ${
                    idx === currentIndex
                      ? "border-[#C5A059] scale-105 filter-none shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                      : "border-transparent opacity-40 hover:opacity-85"
                  }`}
                  id={`lightbox-thumb-${item.id}`}
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </button>
              ))}
            </div>

            {/* Pagination helper for mobile */}
            <div className="lg:hidden text-xs text-stone-400 font-mono tracking-wider shrink-0 bg-stone-900/40 px-2.5 py-1 rounded">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
