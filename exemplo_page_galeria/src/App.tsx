/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Menu, 
  X, 
  Image as ImageIcon, 
  ArrowRight, 
  Phone,
  Mail,
  Calendar,
  Layers,
  Award,
  BookOpen
} from "lucide-react";
import { ALBUMS } from "./data";
import { Photo } from "./types";
import Lightbox from "./components/Lightbox";
import InstagramGrid from "./components/InstagramGrid";
import InfoSection from "./components/InfoSection";

export default function App() {
  const [activeCategory, setActiveCategory] = useState<"all" | "sede" | "conferencia" | "teambuilding">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [activePhotosList, setActivePhotosList] = useState<Photo[]>([]);
  const [activeAlbumTitle, setActiveAlbumTitle] = useState("");

  const filteredAlbums = activeCategory === "all" 
    ? ALBUMS 
    : ALBUMS.filter(album => album.category === activeCategory);

  const openAlbumLightbox = (photos: Photo[], title: string, startPhotoId: string) => {
    setActivePhotosList(photos);
    setActiveAlbumTitle(title);
    setActivePhotoId(startPhotoId);
  };

  const handleScrollToId = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased flex flex-col justify-between selection:bg-[#C5A059] selection:text-white" id="main-scroller">
      
      {/* HEADER NAV COMPONENT (Responsive & Sticky) */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          
          {/* Brand Logo Layout */}
          <a href="#" className="flex items-center gap-2 px-1 hover:opacity-95" id="brand-logo-id">
            <Building2 size={24} className="text-black shrink-0" />
            <div className="flex flex-col">
              <span className="font-extrabold text-[13px] md:text-base tracking-[0.2em] font-sans leading-none uppercase text-black">
                M2 INTELLIGENCE
              </span>
              <span className="font-semibold text-[10px] md:text-xs tracking-[0.38em] font-sans text-stone-500 uppercase">
                TAX & CONSULTING
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-xs tracking-widest font-semibold font-sans text-stone-500 hover:text-stone-900 transition-colors uppercase"
            >
              Início
            </a>
            <a 
              href="#culture" 
              onClick={(e) => handleScrollToId(e, "culture")}
              className="text-xs tracking-widest font-semibold font-sans text-[#C5A059] border-b-2 border-[#C5A059] pb-0.5 uppercase"
            >
              Galeria
            </a>
            <a 
              href="#partners" 
              onClick={(e) => handleScrollToId(e, "socios-section")}
              className="text-xs tracking-widest font-semibold font-sans text-stone-500 hover:text-stone-900 transition-colors uppercase"
            >
              Sócios
            </a>
            <a 
              href="#instagram" 
              onClick={(e) => handleScrollToId(e, "instagram-integration-section")}
              className="text-xs tracking-widest font-semibold font-sans text-stone-500 hover:text-stone-900 transition-colors uppercase"
            >
              Bastidores
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScrollToId(e, "consulting-booking-form")}
              className="text-xs tracking-widest font-semibold font-sans text-stone-500 hover:text-stone-900 transition-colors uppercase"
            >
              Consultoria VIP
            </a>
          </nav>

          {/* Mobile hamburger toggle button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-stone-100 rounded text-stone-700 transition"
            aria-label="Abrir menu"
            id="mobile-hamburguer-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile slide-down navigation drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 px-5 py-4 space-y-4 shadow-inner animate-fade-in" id="mobile-nav-drawer">
            <nav className="flex flex-col gap-3">
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setMobileMenuOpen(false); }}
                className="text-xs font-bold tracking-widest uppercase text-stone-600 block py-1 border-b border-stone-50"
              >
                Início
              </a>
              <a 
                href="#culture"
                onClick={(e) => handleScrollToId(e, "culture")}
                className="text-xs font-extrabold tracking-widest uppercase text-[#C5A059] block py-1 border-b border-stone-50"
              >
                Galeria M2
              </a>
              <a 
                href="#partners"
                onClick={(e) => handleScrollToId(e, "socios-section")}
                className="text-xs font-bold tracking-widest uppercase text-stone-600 block py-1 border-b border-stone-50"
              >
                Sócios Fundadores
              </a>
              <a 
                href="#instagram"
                onClick={(e) => handleScrollToId(e, "instagram-integration-section")}
                className="text-xs font-bold tracking-widest uppercase text-stone-600 block py-1 border-b border-stone-50"
              >
                Instagram & Feed
              </a>
              <a 
                href="#contact"
                onClick={(e) => handleScrollToId(e, "consulting-booking-form")}
                className="text-xs font-bold tracking-widest uppercase text-white bg-[#C5A059] text-center rounded py-2 block"
              >
                Agendar Consultoria
              </a>
            </nav>
            
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[11px] text-stone-400 font-mono">
              <div className="flex gap-1.5 items-center">
                <Phone size={10} />
                <span>+55 (11) 3957-2200</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <Mail size={10} />
                <span>contato@m2tax.com</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        
        {/* HERO SECTION / NOSSA CULTURA (Dark Cosmic Aesthetic) */}
        <section className="bg-black text-white py-16 md:py-24 px-5 relative overflow-hidden text-center" id="culture">
          {/* Subtle gold decoration points */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.08),transparent_40%)] pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_70%)] pointer-events-none blur-2xl"></div>

          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <span className="text-[10px] md:text-xs text-[#C5A059] font-mono font-bold tracking-[0.3em] uppercase mb-4 block" style={{ letterSpacing: "0.25em" }}>
              NOSSA CULTURA
            </span>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white font-sans uppercase">
              Galeria M2
            </h1>

            <p className="text-sm md:text-lg text-stone-300 max-w-2xl leading-relaxed font-light mb-8">
              Transparência, excelência corporativa e a dedicação da nossa equipe refletidas em nosso ambiente de trabalho e eventos de mercado. Conheça os bastidores e os marcos de sucesso da M2 Intelligence Tax.
            </p>

            <div className="w-16 h-[3px] bg-[#C5A059] rounded-full mb-4"></div>

            {/* Quick stats counter within Hero container */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 font-mono text-[11px] text-stone-400 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Layers size={11} className="text-[#C5A059]" /> {ALBUMS.length} Álbuns Exclusivos
              </span>
              <span className="hidden md:inline text-stone-700">•</span>
              <span className="flex items-center gap-1">
                <ImageIcon size={11} className="text-[#C5A059]" /> 15+ Capturas de Alta Resolução
              </span>
            </div>
          </div>
        </section>

        {/* PHOTO FILTERING ENGINE AND CARDS CONTAINER */}
        <section className="py-12 md:py-20 px-5 max-w-6xl mx-auto" id="albums-portfolio">
          
          {/* Categories Selector Tabs */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 bg-stone-100 p-1 rounded-sm border border-stone-200">
              <button
                onClick={() => setActiveCategory("all")}
                className={`py-2 px-5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-white text-black shadow-sm border border-stone-250/20"
                    : "text-stone-600 hover:text-black hover:bg-stone-50"
                }`}
                id="filter-category-all"
              >
                Todos
              </button>
              <button
                onClick={() => setActiveCategory("sede")}
                className={`py-2 px-5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                  activeCategory === "sede"
                    ? "bg-white text-black shadow-sm border border-stone-250/20"
                    : "text-stone-600 hover:text-black hover:bg-stone-50"
                }`}
                id="filter-category-sede"
              >
                Sede
              </button>
              <button
                onClick={() => setActiveCategory("conferencia")}
                className={`py-2 px-5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                  activeCategory === "conferencia"
                    ? "bg-white text-black shadow-sm border border-stone-250/20"
                    : "text-stone-600 hover:text-black hover:bg-stone-50"
                }`}
                id="filter-category-conferencia"
              >
                Eventos
              </button>
              <button
                onClick={() => setActiveCategory("teambuilding")}
                className={`py-2 px-5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-sm cursor-pointer ${
                  activeCategory === "teambuilding"
                    ? "bg-white text-black shadow-sm border border-stone-250/20"
                    : "text-stone-600 hover:text-black hover:bg-stone-50"
                }`}
                id="filter-category-teambuilding"
              >
                Integração
              </button>
            </div>
            
            <p className="text-xs text-stone-500 italic mt-3 text-center">
              * Clique em "Ver Álbum Completo" ou diretamente na fotografia para abrir as galerias de slides interativos com descrições fiscais.
            </p>
          </div>

          {/* ALBUM CARDS GRID (Pristine execution aligned with corporate specs) */}
          <div className="space-y-12 md:space-y-16" id="albums-containers">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                className="bg-black border-2 border-[#C5A059] rounded p-5 md:p-8 flex flex-col gap-6 shadow-md transition-all duration-300 hover:shadow-xl hover:border-[#b08d48]"
                id={`album-box-${album.id}`}
              >
                {/* Header info layout within album */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-800 pb-5">
                  <div className="max-w-2xl">
                    <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059] mb-1.5 block">
                      {album.category === "sede" ? "Sede e Infraestrutura" : 
                       album.category === "conferencia" ? "Palestras & Conferências" : 
                       "Team Building & Integração"}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#C5A059]" style={{ fontFamily: "Montserrat" }}>
                      {album.title}
                    </h3>
                    
                    <p className="text-xs md:text-sm text-stone-300 font-light mt-2 leading-relaxed">
                      {album.description}
                    </p>

                    {/* Meta labels */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[10px] md:text-xs text-stone-400 font-mono">
                      <span>📆 {album.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>📍 {album.location}</span>
                    </div>
                  </div>

                  {/* Album full click button */}
                  <button
                    onClick={() => openAlbumLightbox(album.photos, album.title, album.photos[0].id)}
                    className="inline-flex items-center gap-2 border border-[#C5A059] hover:bg-[#C5A059] text-[#C5A059] hover:text-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest duration-300 transition-all w-full md:w-auto justify-center select-none cursor-pointer rounded-sm shrink-0"
                    style={{ letterSpacing: "0.15em" }}
                    id={`album-btn-${album.id}`}
                  >
                    VER ÁLBUM COMPLETO
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Cover representation with quick view on hover */}
                <div 
                  onClick={() => openAlbumLightbox(album.photos, album.title, album.photos[0].id)}
                  className="group h-[250px] md:h-[400px] w-full overflow-hidden rounded border border-stone-805 cursor-pointer relative"
                  id={`album-img-mask-${album.id}`}
                >
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  
                  {/* Glowing hover state indicating album is interactive */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white border border-[#C5A059]/40 rounded">
                    <div className="bg-black/85 backdrop-blur-sm px-6 py-3 rounded-sm border border-[#C5A059] flex items-center gap-2.5 shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <ImageIcon size={16} className="text-[#C5A059]" />
                      <span className="text-xs font-bold uppercase tracking-widest font-mono text-stone-100">
                        ABRIR GALERIA INTERATIVA ({album.photos.length} FOTOS)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro album stats grid */}
                {album.stats && (
                  <div className="grid grid-cols-3 gap-4 pt-1 text-stone-400 mt-2">
                    {album.stats.map((stat, i) => (
                      <div key={i} className="border-l border-stone-800 pl-4">
                        <div className="text-[10px] md:text-xs text-stone-500 uppercase font-mono font-medium">{stat.label}</div>
                        <div className="text-xs md:text-base font-bold text-white font-sans mt-0.5">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TEAM MEMBERS, TESTIMONIALS AND BOOKING FORM CONTAINER */}
        <InfoSection />

        {/* INSTAGRAM INTERACTIVE FEED SECTION */}
        <InstagramGrid />

        {/* ACCORDION / CORE CAPABILITIES SUMMARY (Extra visual value) */}
        <section className="bg-stone-900 text-white py-14 px-5 border-t border-stone-800" id="m2-capabilities">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <span className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded">
                <Award size={18} />
              </span>
              <div>
                <dt className="text-xs font-bold tracking-wider uppercase text-[#C5A059] font-sans mb-1">Rigor Legal</dt>
                <dd className="text-xs text-stone-400 leading-relaxed font-light">Todas as nossas teses fiscais de grande porte passam por escrutínio duplo, com pareceres emitidos por juristas eméritos.</dd>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded">
                <BookOpen size={18} />
              </span>
              <div>
                <dt className="text-xs font-bold tracking-wider uppercase text-[#C5A059] font-sans mb-1">Cultura Didática</dt>
                <dd className="text-xs text-stone-400 leading-relaxed font-light">Apoiamos a formação contínua através de nosso M2 Strategy Lab, com seminários internos mensais abertos a trainees e associados.</dd>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded">
                <Building2 size={18} />
              </span>
              <div>
                <dt className="text-xs font-bold tracking-wider uppercase text-[#C5A059] font-sans mb-1">Infraestrutura Segura</dt>
                <dd className="text-xs text-stone-400 leading-relaxed font-light">Operamos sob estritos protocolos corporativos e VPN dedicada para garantir segredo de justiça absoluto em diagnósticos fiscais.</dd>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-stone-950 text-stone-400 border-t border-stone-900 pt-16 pb-12 px-5">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-stone-800 pb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={20} className="text-[#C5A059]" />
                <span className="font-extrabold text-sm tracking-[0.25em] text-white">M2 INTELLIGENCE TAX</span>
              </div>
              <p className="text-xs text-stone-500 max-w-sm font-light leading-relaxed">
                Segurança, inteligência fiscal integrada e solidez jurídica no patrocínio de interesses de corporações e entidades setoriais nacionais.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs tracking-widest text-[#C5A059]">
              <a href="#" className="hover:text-white transition-colors uppercase">INÍCIO</a>
              <a href="#albums" onClick={(e) => handleScrollToId(e, "culture")} className="hover:text-white transition-colors uppercase">ÁLBUNS</a>
              <a href="#team" onClick={(e) => handleScrollToId(e, "socios-section")} className="hover:text-white transition-colors uppercase">CONSELHO</a>
              <a href="#instagram" onClick={(e) => handleScrollToId(e, "instagram-integration-section")} className="hover:text-white transition-colors uppercase">REDES</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6" id="footer-bottom-grid">
            <div className="text-[10px] md:text-xs font-semibold text-stone-500 tracking-wider text-center md:text-left">
              © 2024 M2 INTELLIGENCE TAX. ALL RIGHTS RESERVED.
            </div>

            <nav className="flex flex-wrap justify-center gap-6 font-mono text-[10px] text-stone-500">
              <a href="#" className="hover:text-white transition-colors">Expertise</a>
              <span>/</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>/</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>/</span>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </footer>

      {/* RENDER EMBEDDED SLIDING GALLERY LIGHTBOX MODE */}
      {activePhotoId && (
        <Lightbox
          photos={activePhotosList}
          initialPhotoId={activePhotoId}
          onClose={() => setActivePhotoId(null)}
          albumTitle={activeAlbumTitle}
        />
      )}
    </div>
  );
}
