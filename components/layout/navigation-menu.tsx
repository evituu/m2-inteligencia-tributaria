import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { label: "HOME", href: "#" },
  { label: "SERVIÇOS", href: "#" },
  { label: "SOBRE", href: "#" },
];

export function NavigationMenu() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-zinc-800/80 bg-[#060b12]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-22 w-full max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-2xl font-extrabold tracking-tight text-[#f2c40f] md:text-4xl"
        >
          <Image
            src="/imagens/logo/m2_logo_sem_fundo.png"
            alt="Logo M2 Inteligência Tributária"
            width={84}
            height={84}
            className="h-9 w-9 object-contain md:h-11 md:w-11"
            priority
          />
          <span>Inteligência Tributária</span>
        </Link>

        <nav className="hidden items-center gap-9 text-xs font-semibold tracking-wide text-zinc-100 lg:flex">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative pb-1 transition-colors hover:text-[#f2c40f]"
            >
              {item.label}
              {index === 0 ? (
                <span className="absolute -bottom-[14px] left-0 h-[2px] w-full bg-[#f2c40f]" />
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
