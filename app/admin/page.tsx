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
};

const fallbackMetrics: Metrics = {
  published: 0,
  draft: 0,
  archived: 0,
};

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
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard title="Publicados" value={metrics.published} loading={loading} accentClass="text-emerald-300" />
            <KpiCard title="Rascunhos" value={metrics.draft} loading={loading} accentClass="text-amber-300" />
            <KpiCard title="Desativados" value={metrics.archived} loading={loading} accentClass="text-zinc-300" />
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
            <h2 className="text-lg font-bold text-white">Proximas acoes</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Use o atalho de criacao para abrir o formulario do artigo e publicar com mais velocidade.
            </p>
            <Link
              href="/admin/posts"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-[#f2c40f] px-4 text-sm font-semibold text-[#12151b] hover:bg-[#e3b80d]"
            >
              Gerenciar artigos
            </Link>
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

