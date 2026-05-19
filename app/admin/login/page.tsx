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
    router.push("/admin/posts");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6 py-12">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-extrabold text-[#12151b]">Login Admin</h1>
        <p className="mt-2 text-sm text-zinc-600">Acesso ao dashboard do blog.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-800" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-800" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full rounded-md bg-[#12151b] text-sm font-semibold text-white transition hover:bg-[#1c222c] disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
