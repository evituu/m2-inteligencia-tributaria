"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
  { label: "HOME", href: "/" },
  { label: "SOBRE", href: "/sobre" },
  { label: "SERVIÇOS", href: "/servicos" },
];

export function NavigationMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-zinc-800/80 bg-[#060b12]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-22 w-full max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-2xl font-extrabold tracking-tight text-[#f2c40f] md:text-4xl"
        >
          <Image
            src="/imagens/logo/LOGO_M2.png"
            alt="Logo M2 Inteligência Tributária"
            width={100}
            height={100}
            className="h-12 w-12 object-contain md:h-16 md:w-16"
            priority
          />
          <span>Inteligência Tributária</span>
        </Link>

        <nav className="hidden items-center gap-9 text-xs font-semibold tracking-wide text-zinc-100 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="relative pb-1 transition-colors hover:text-[#f2c40f]"
            >
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute -bottom-[14px] left-0 h-[2px] w-full bg-[#f2c40f]" />
              ) : null}
            </Link>
          ))}
        </nav>

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
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`rounded-md px-4 py-3 text-sm font-semibold tracking-wide transition-colors ${
                      isActive(item.href)
                        ? "bg-[#f2c40f]/15 text-[#f2c40f]"
                        : "text-zinc-200 hover:bg-white/5 hover:text-[#f2c40f]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
