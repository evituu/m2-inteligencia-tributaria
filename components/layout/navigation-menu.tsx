"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GoldText } from "@/components/shared/GoldText";

const whatsappUrl =
  "https://wa.me/5588992156717?text=Ol%C3%A1!%20Gostaria%20de%20uma%20an%C3%A1lise%20tribut%C3%A1ria%20gratuita.";

const menuItems = [
  { label: "HOME", href: "/" },
  { label: "SOBRE", href: "/sobre" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "BLOG", href: "/blog" },
   {label: "GALERIA", href: "/galeria-m2"},
  { label: "CONTATO", href: "/#formulario" },
];

export function NavigationMenu() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-zinc-800/80 bg-[#060b12]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-22 w-full max-w-[1280px] items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-heading text-xl font-extrabold tracking-tight md:text-3xl"
        >
          <Image
            src="/imagens/logo/LOGO_M2.png"
            alt="Logo M2 Inteligência Tributária"
            width={100}
            height={100}
            className="h-12 w-12 shrink-0 object-contain md:h-16 md:w-16"
            priority
          />
          <GoldText>Inteligência Tributária</GoldText>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <nav className="flex items-center gap-7 text-xs font-semibold tracking-wide text-zinc-100">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative pb-1 transition-colors hover:text-[#f2c40f]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center bg-[#c9a84c] px-5 text-center text-xs font-black uppercase tracking-wide text-black transition-all hover:brightness-110"
          >
            Falar com especialista
          </a>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-100 hover:bg-white/10 hover:text-[#f2c40f] lg:hidden"
              aria-label="Abrir menu"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[84%] border-zinc-800 bg-[#060b12] text-zinc-100 sm:max-w-sm"
          >
            <div className="mt-8 flex flex-col gap-2">
              {menuItems.map((item) => (
                <SheetClose asChild key={item.label}>
                  <Link
                    href={item.href}
                    className="rounded-md px-4 py-3 text-sm font-semibold tracking-wide text-zinc-200 transition-colors hover:bg-white/5 hover:text-[#f2c40f]"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}

              <SheetClose asChild>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-11 items-center justify-center bg-[#c9a84c] px-4 text-sm font-black uppercase tracking-wide text-black"
                >
                  Falar com especialista
                </a>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
