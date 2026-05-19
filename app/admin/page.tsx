"use client";

import { useEffect, useState } from "react";
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
    <AdminShell
      title="Dashboard do Blog"
      subtitle="Visão editorial rápida de publicações, rascunhos e desativados."
      primaryAction={{ label: "Inserir novo artigo", href: "/admin/posts/novo" }}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Publicados" value={metrics.published} loading={loading} accentClass="text-emerald-300" />
        <KpiCard title="Rascunhos" value={metrics.draft} loading={loading} accentClass="text-amber-300" />
        <KpiCard title="Desativados" value={metrics.archived} loading={loading} accentClass="text-zinc-300" />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
        <h2 className="text-lg font-bold text-white">Próximas ações</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Use o atalho de criação para abrir o formulário do artigo e publicar com mais velocidade.
        </p>
      </section>
    </AdminShell>
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

