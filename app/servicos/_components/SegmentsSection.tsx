"use client";

import {
  Beef,
  Car,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Disc,
  Drumstick,
  Flame,
  FuelIcon,
  PawPrint,
  Pill,
  ShoppingCart,
  Sparkles,
  Tractor,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";

interface SegmentItem {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
}

const segments: SegmentItem[] = [
  { name: "Autopeças", icon: Car },
  { name: "Revenda de pneus", icon: Disc },
  { name: "Máquinas agrícolas", icon: Tractor },
  { name: "Postos de combustíveis", icon: FuelIcon },
  { name: "Revenda de gás", icon: Flame },
  { name: "Pet shops", icon: PawPrint },
  { name: "Farmácias", icon: Pill },
  { name: "Perfumarias e cosméticos", icon: Sparkles },
  { name: "Supermercados", icon: ShoppingCart },
  { name: "Bares e restaurantes", icon: Coffee },
  { name: "Açougues", icon: Drumstick },
  { name: "Frigoríficos", icon: Beef },
];

const AUTOPLAY_MS = 4000;
const GAP = 20;

function getVisibleCount(width: number) {
  if (width >= 1024) return 5;
  if (width >= 768) return 3;
  if (width >= 500) return 2;
  return 1;
}

export function SegmentsSection() {
  const total = segments.length;
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [measure, setMeasure] = useState({ cardW: 220, visible: 5 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remeasure = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    setContainerWidth(w);
    const v = getVisibleCount(w);
    const cardW = (w - GAP * (v - 1)) / v;
    setMeasure({ cardW, visible: v });
  }, []);

  useEffect(() => {
    remeasure();
    window.addEventListener("resize", remeasure);
    return () => window.removeEventListener("resize", remeasure);
  }, [remeasure]);

  const goTo = useCallback(
    (index: number) => setCurrent(((index % total) + total) % total),
    [total],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_MS);
  }, [total]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleManual = useCallback(
    (action: () => void) => {
      action();
      resetTimer();
    },
    [resetTimer],
  );

  const { cardW, visible } = measure;
  const centerOffset =
    (containerWidth || cardW * visible + GAP * (visible - 1)) / 2 - cardW / 2;
  const translateX = -current * (cardW + GAP) + centerOffset;

  const distanceFromCenter = (index: number) => {
    const raw = index - current;
    const wrapped = ((raw + total / 2) % total) - total / 2;
    return Math.abs(wrapped);
  };

  return (
    <section className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 max-w-[760px]">
          <span className="bg-gold-gradient mb-5 block h-1.5 w-14" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Segmentos <span className="text-gold-gradient">atendidos</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-[#3b3f47] md:text-lg">
            Atuamos com empresas de diversos setores que possuem oportunidades
            específicas de recuperação tributária e previdenciária.
          </p>
        </div>

        <div className="relative" ref={containerRef}>
          <div className="overflow-hidden py-6">
            <div
              className="flex will-change-transform"
              style={{
                gap: GAP,
                transform: `translateX(${translateX}px)`,
                transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {segments.map(({ name, icon: Icon }, i) => {
                const dist = distanceFromCenter(i);
                const isCurrent = i === current;
                const halfVisible = Math.floor(visible / 2);
                const opacity = dist <= halfVisible ? 1 - dist * 0.2 : 0.3;
                const scale = isCurrent ? 1.04 : 1 - dist * 0.02;

                return (
                  <article
                    key={name}
                    className="flex shrink-0 flex-col items-center gap-4 rounded-2xl border bg-white px-5 py-8"
                    style={{
                      width: cardW,
                      opacity,
                      transform: `scale(${scale})`,
                      transition:
                        "opacity 1s cubic-bezier(0.4,0,0.2,1), transform 1s cubic-bezier(0.4,0,0.2,1), border-color 0.8s ease, box-shadow 0.8s ease",
                      borderColor: isCurrent ? "#d7aa52" : "rgb(228 228 231)",
                      boxShadow: isCurrent
                        ? "0 8px 30px rgba(217,173,85,0.2)"
                        : "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{
                        background: isCurrent
                          ? "linear-gradient(135deg, #d9ad55 0%, #f6de95 42%, #e8c676 70%, #d7aa52 100%)"
                          : "rgba(217,173,85,0.16)",
                        color: isCurrent ? "#fff" : "#d7aa52",
                        boxShadow: isCurrent
                          ? "0 4px 12px rgba(217,173,85,0.34)"
                          : "none",
                        transition:
                          "background 0.8s ease, color 0.8s ease, box-shadow 0.8s ease",
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className="text-center text-sm font-semibold leading-5"
                      style={{
                        color: isCurrent ? "#12151b" : "#a1a1aa",
                        transition: "color 0.8s ease",
                      }}
                    >
                      {name}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleManual(prev)}
            aria-label="Segmento anterior"
            className="absolute -left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#12151b] shadow-md transition-all duration-300 hover:border-[#d7aa52] hover:text-[#d7aa52] md:-left-4 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleManual(next)}
            aria-label="Próximo segmento"
            className="absolute -right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#12151b] shadow-md transition-all duration-300 hover:border-[#d7aa52] hover:text-[#d7aa52] md:-right-4 md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {segments.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManual(() => goTo(i))}
              aria-label={`Ir para segmento ${i + 1}`}
              className="h-2 rounded-full"
              style={{
                width: i === current ? 28 : 8,
                background:
                  i === current
                    ? "linear-gradient(90deg, #d9ad55 0%, #f6de95 42%, #e8c676 70%, #d7aa52 100%)"
                    : "#d4d4d8",
                transition: "width 0.6s ease, background 0.6s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
