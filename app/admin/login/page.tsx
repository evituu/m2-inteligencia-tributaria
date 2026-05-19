"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function getCsrfToken() {
    const response = await fetch("/api/auth/csrf", { method: "GET" });
    const data = (await response.json()) as { csrfToken?: string };
    return data.csrfToken || "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    const csrfToken = await getCsrfToken();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ email, password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage("Credenciais inválidas.");
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/admin")) {
      router.push(next);
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070d] px-4 py-8">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-52 w-52 rounded-full bg-[#f2c40f]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-56 w-56 rounded-full bg-[#f2c40f]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-[#060b12]/95 p-6 shadow-2xl shadow-black/40 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">M2 Admin</p>
        <h1 className="mt-2 text-3xl font-black text-white">Login do painel</h1>
        <p className="mt-2 text-sm text-zinc-400">Acesse para gerenciar artigos e publicação do blog.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full rounded-md bg-[#f2c40f] text-sm font-semibold text-[#12151b] transition hover:bg-[#e3b80d] disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar no dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}

