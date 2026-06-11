"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  children: ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Artigos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/gallery", label: "Galeria" },
];

export function AdminShell({ title, subtitle, primaryAction, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <main className="min-h-screen bg-[#04070d] text-zinc-100">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a84c]">M2 Admin</p>
          <p className="mt-1 text-lg font-bold text-white">Dashboard</p>
          <nav className="mt-5 flex flex-wrap gap-2 lg:flex-col">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#f2c40f] text-[#12151b]"
                      : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="mt-2 inline-flex h-10 items-center rounded-md border border-zinc-700 px-3 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-50 lg:mt-4"
            >
              {loggingOut ? "Saindo..." : "Sair"}
            </button>
          </nav>
        </aside>

        <section className="min-w-0 space-y-6">
          <header className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white md:text-3xl">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
              </div>
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-4 text-sm font-semibold text-[#12151b] transition hover:bg-[#e3b80d]"
                >
                  {primaryAction.label}
                </Link>
              ) : null}
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}

