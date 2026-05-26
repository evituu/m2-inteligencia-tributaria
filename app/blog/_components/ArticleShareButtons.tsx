"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

interface ArticleShareButtonsProps {
  title: string;
  slug: string;
}

export function ArticleShareButtons({ title, slug }: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `https://m2inteligenciatributaria.com.br/blog/${slug}`;

  const handleWhatsApp = () => {
    const url = getUrl();
    const text = encodeURIComponent(`${title}\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener noreferrer");
  };

  const handleFacebook = () => {
    const url = encodeURIComponent(getUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener noreferrer",
    );
  };

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback silencioso
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        Compartilhar
      </span>

      <div className="flex items-center gap-3">
        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          aria-label="Compartilhar no WhatsApp"
          className="group flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-700 transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.117.554 4.104 1.523 5.83L.057 23.213a.75.75 0 0 0 .92.92l5.383-1.466A11.944 11.944 0 0 0 12.004 24C18.63 24 24 18.626 24 12S18.63 0 12.004 0zm0 21.818a9.763 9.763 0 0 1-4.976-1.362l-.356-.212-3.695 1.005.979-3.588-.232-.369A9.788 9.788 0 0 1 2.182 12c0-5.42 4.403-9.818 9.822-9.818C17.422 2.182 21.818 6.58 21.818 12c0 5.421-4.396 9.818-9.814 9.818z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebook}
          aria-label="Compartilhar no Facebook"
          className="group flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-700 transition-all duration-200 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
        </button>

        {/* Instagram — copia o link */}
        <button
          onClick={handleInstagram}
          aria-label="Copiar link para compartilhar no Instagram"
          className="group relative flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-700 transition-all duration-200 hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white"
        >
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <FaInstagram className="h-5 w-5" />
          )}
          {/* Tooltip */}
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {copied ? "Link copiado!" : "Copiar link"}
          </span>
        </button>

        {/* Copiar link */}
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(getUrl());
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            } catch {
              // fallback silencioso
            }
          }}
          aria-label="Copiar link do artigo"
          className="flex h-11 items-center gap-2 border border-zinc-200 bg-white px-4 text-xs font-bold uppercase tracking-widest text-zinc-600 transition-all duration-200 hover:border-[#f2c40f] hover:text-[#12151b]"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {copied ? "Copiado!" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
