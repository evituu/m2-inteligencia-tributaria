import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#12151b]">Dashboard Admin</h1>
        <p className="mt-2 text-sm text-zinc-600">Gerencie conteúdo do blog e operação editorial.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#12151b] px-4 text-sm font-semibold text-white"
            href="/admin/posts"
          >
            Gerenciar posts
          </Link>
        </div>
      </div>
    </main>
  );
}
