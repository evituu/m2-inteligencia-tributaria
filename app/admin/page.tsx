"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "./_components/AdminShell";

type Metrics = {
  published: number;
  draft: number;
  archived: number;
  albums: number;
  photos: number;
};

const fallbackMetrics: Metrics = { published: 0, draft: 0, archived: 0, albums: 0, photos: 0 };

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics>(fallbackMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await fetch("/api/admin/posts/metrics");
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = (await response.json()) as Partial<Metrics>;
        setMetrics({
          published: data.published ?? 0,
          draft: data.draft ?? 0,
          archived: data.archived ?? 0,
          albums: data.albums ?? 0,
          photos: data.photos ?? 0,
        });
      } catch {
        setMetrics(fallbackMetrics);
      } finally {
        setLoading(false);
      }
    }

    void loadMetrics();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#04070d]">
      <NavigationMenu />
      <div className="flex-1 pt-22">
        <AdminShell
          title="Dashboard do Blog"
          subtitle="Visao editorial rapida de publicacoes, rascunhos e desativados."
          primaryAction={{ label: "Inserir novo artigo", href: "/admin/posts/novo" }}
        >
          {/* Blog KPIs */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard title="Publicados" value={metrics.published} loading={loading} accentClass="text-emerald-300" />
            <KpiCard title="Rascunhos" value={metrics.draft} loading={loading} accentClass="text-amber-300" />
            <KpiCard title="Desativados" value={metrics.archived} loading={loading} accentClass="text-zinc-300" />
          </section>

          {/* Gallery KPIs */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <KpiCard title="Álbuns" value={metrics.albums} loading={loading} accentClass="text-sky-300" />
            <KpiCard title="Fotos" value={metrics.photos} loading={loading} accentClass="text-sky-300" />
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
            <h2 className="text-lg font-bold text-white">Atalhos</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ShortcutCard href="/admin/posts/novo" label="Novo artigo" description="Criar um rascunho" />
              <ShortcutCard href="/admin/gallery/novo" label="Novo álbum" description="Criar álbum de fotos" />
              <ShortcutCard href="/admin/categorias" label="Categorias" description="Gerenciar categorias" />
              <ShortcutCard href="/" label="Ver site" description="Abrir o site público" target="_blank" />
            </div>
          </section>
        </AdminShell>
      </div>
      <Footer />
    </div>
  );
}

function KpiCard({
  title,
  value,
  loading,
  accentClass,
}: {
  title: string;
  value: number;
  loading: boolean;
  accentClass: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{title}</p>
      <p className={`mt-3 text-4xl font-black ${accentClass}`}>{loading ? "..." : value}</p>
    </article>
  );
}

function ShortcutCard({ href, label, description, target }: { href: string; label: string; description: string; target?: string }) {
  return (
    <Link
      href={href}
      target={target}
      className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs text-zinc-400">{description}</p>
    </Link>
  );
}
