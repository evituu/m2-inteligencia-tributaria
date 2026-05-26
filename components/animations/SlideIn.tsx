"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SlideInProps {
  from?: "left" | "right" | "bottom";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  children: React.ReactNode;
}

export function SlideIn({
  from = "left",
  delay = 0,
  duration = 1000,
  distance = 100,
  className,
  children,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initial: Record<string, string> = {
    left: `translateX(-${distance}px)`,
    right: `translateX(${distance}px)`,
    bottom: `translateY(${distance}px)`,
  };

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden", className)}
      style={{
        transform: visible ? "translate(0, 0)" : initial[from],
        opacity: visible ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, opacity ${duration}ms ease ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
