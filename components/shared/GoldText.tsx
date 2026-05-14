import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GoldTextProps<T extends ElementType = "span"> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export function GoldText<T extends ElementType = "span">({
  as,
  children,
  className,
}: GoldTextProps<T>) {
  const Component = (as ?? "span") as ElementType;

  return (
    <Component className={cn("text-gold-gradient", className)}>
      {children}
    </Component>
  );
}
