"use client";

import { useEffect, useRef, useState } from "react";
import { Banknote, BriefcaseBusiness, MapPinned, Scale } from "lucide-react";

const metrics = [
  {
    label: "Recuperados para nossos clientes",
    value: 156,
    prefix: "R$ ",
    suffix: "milhões+",
    icon: Banknote,
  },
  {
    label: "Empresas atendidas",
    value: 473,
    icon: BriefcaseBusiness,
  },
  {
    label: "Atuação nacional",
    textValue: "Todo o Brasil",
    icon: MapPinned,
  },
  {
    label: "Linhas de serviço tributário",
    value: 6,
    icon: Scale,
  },
];

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  shouldStart,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  shouldStart: boolean;
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const duration = 1700;
    const startTime = performance.now();
    let animationFrameId = 0;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCurrentValue(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldStart, value]);

  return (
    <span className="inline-flex flex-col items-center leading-[1.05]">
      <span className="whitespace-nowrap">
        {prefix}
        {currentValue.toLocaleString("pt-BR")}
      </span>
      {suffix && (
        <span className="mt-1 text-[0.72em] leading-none">{suffix}</span>
      )}
    </span>
  );
}

export function NumbersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldStartCount, setShouldStartCount] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="resultados"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05090c] py-18 text-white md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(242,196,15,0.14),_transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mx-auto mb-4 block h-1 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
            Nossos <span className="text-gold-gradient">Números</span>
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400 md:text-base">
            Indicadores que refletem escala, solidez operacional e presença
            nacional na recuperação de créditos tributários.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ label, value, textValue, prefix, suffix, icon: Icon }) => (
            <article
              key={label}
              className="group relative overflow-hidden border border-white/10 bg-white/[0.03] px-5 py-7 text-center shadow-2xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/70 md:px-6 md:py-8"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#f2c40f]/45 bg-[#f2c40f]/10 text-[#f2c40f]">
                <Icon className="h-6 w-6" />
              </div>
              <p className="min-h-[96px] text-3xl font-black leading-[1.08] tracking-tight text-white md:text-4xl lg:text-5xl">
                {typeof value === "number" ? (
                  <AnimatedNumber
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    shouldStart={shouldStartCount}
                  />
                ) : (
                  <span>{textValue}</span>
                )}
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
                {label}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-zinc-500">
          *Dados consolidados. Valores recuperados via restituição e compensação
          homologadas pela Receita Federal.
        </p>
      </div>
    </section>
  );
}
