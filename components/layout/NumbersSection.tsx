"use client";

import { useEffect, useRef, useState } from "react";
import { Banknote, Map, Users } from "lucide-react";

const metrics = [
  {
    label: "recuperados para nossos clientes",
    value: 800,
    prefix: "R$ ",
    suffix: "M+",
    icon: Banknote,
  },
  {
    label: "empresas que atendemos",
    value: 1000,
    suffix: "+",
    icon: Users,
  },
  {
    label: "estados com atuação nacional",
    value: 15,
    suffix: "+",
    icon: Map,
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
    <span>
      {prefix}
      {currentValue.toLocaleString("pt-BR")}
      {suffix}
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
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05090c] py-18 text-white md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(242,196,15,0.14),_transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mx-auto mb-4 block h-1 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">
            Nossos Números
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400 md:text-base">
            Indicadores que refletem escala, solidez operacional e presença
            nacional na recuperação estratégica de ativos.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map(({ label, value, prefix, suffix, icon: Icon }) => (
            <article
              key={label}
              className="group relative overflow-hidden border border-white/10 bg-white/[0.03] px-5 py-7 text-center shadow-2xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/70 md:px-6 md:py-8"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#f2c40f]/45 bg-[#f2c40f]/10 text-[#f2c40f]">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-4xl font-black leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
                <AnimatedNumber
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  shouldStart={shouldStartCount}
                />
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
                {label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
