import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-slate-600">Area interna para operacao do blog.</p>
      <div className="mt-6">
        <Link className="text-sm font-medium text-blue-700 underline" href="/admin/posts">
          Gerenciar posts
        </Link>
      </div>
    </main>
  );
}
