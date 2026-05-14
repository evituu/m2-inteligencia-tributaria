import {
  Beef,
  Car,
  Coffee,
  Disc,
  Drumstick,
  Flame,
  FuelIcon,
  Heart,
  PawPrint,
  Pill,
  ShoppingCart,
  Sparkles,
  Tractor,
  Users,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

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
  { name: "Empresas com folha de pagamento relevante", icon: Users },
  { name: "Empresas com benefícios e adicionais relevantes", icon: Heart },
];

export function SegmentsSection() {
  return (
    <section className="bg-[#efefef] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-12 max-w-[760px]">
          <span className="mb-5 block h-1.5 w-14 bg-[#f2c40f]" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-[#12151b] md:text-5xl">
            Segmentos atendidos
          </h2>
          <p className="mt-5 text-base leading-7 text-[#3b3f47] md:text-lg">
            Atuamos com empresas de diversos setores que possuem oportunidades
            específicas de recuperação tributária e previdenciária.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {segments.map(({ name, icon: Icon }) => (
            <article
              key={name}
              className="flex h-full items-center gap-3 border border-zinc-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/60 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2c40f]/15 text-[#c9a227]">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium leading-5 text-[#12151b]">
                {name}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
