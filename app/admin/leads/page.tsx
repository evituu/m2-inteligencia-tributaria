"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";

type AdminLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  companySize: string | null;
  monthlyRevenue: string | null;
  taxRegime: string | null;
  message: string | null;
  source: string | null;
  createdAt: string;
};

type LeadsResponse = {
  leads: AdminLead[];
  total: number;
  page: number;
  pageSize: number;
};

export default function AdminLeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLeads(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads?page=${targetPage}`);
      if (!res.ok) throw new Error("Falha ao carregar leads.");
      const json = (await res.json()) as LeadsResponse;
      setData(json);
    } catch {
      setError("Não foi possível carregar os leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeads(page);
  }, [page]);

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <AdminShell
      title="Leads"
      subtitle="Contatos recebidos pelo formulário do site."
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {loading ? <p className="text-sm text-zinc-400">Carregando...</p> : null}

        {!loading && data && data.leads.length === 0 ? (
          <p className="text-sm text-zinc-400">Nenhum lead recebido ainda.</p>
        ) : null}

        {!loading && data && data.leads.length > 0 ? (
          <>
            <p className="mb-4 text-xs text-zinc-500">
              {data.total} lead{data.total !== 1 ? "s" : ""} no total · página {data.page} de {totalPages}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3 pr-4">Nome</th>
                    <th className="pb-3 pr-4">E-mail</th>
                    <th className="pb-3 pr-4">Telefone</th>
                    <th className="pb-3 pr-4">Empresa</th>
                    <th className="pb-3 pr-4">Regime</th>
                    <th className="pb-3">Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-zinc-800/60 transition hover:bg-zinc-900/40"
                    >
                      <td className="py-3 pr-4 text-xs text-zinc-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 pr-4 font-medium text-white whitespace-nowrap">
                        {lead.fullName}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[#f2c40f] transition-colors"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3 pr-4 text-zinc-300 whitespace-nowrap">
                        {lead.phone ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">
                        {lead.company ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300 whitespace-nowrap">
                        {lead.taxRegime ?? "—"}
                      </td>
                      <td className="py-3 max-w-[200px]">
                        {lead.message ? (
                          <span
                            title={lead.message}
                            className="block truncate text-zinc-400"
                          >
                            {lead.message}
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-xs text-zinc-500">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima →
              </button>
            </div>
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}
