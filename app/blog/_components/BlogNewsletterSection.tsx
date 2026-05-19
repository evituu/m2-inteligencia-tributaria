"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export function BlogNewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        throw new Error("Falha ao assinar newsletter");
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("Nao foi possivel concluir a assinatura. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[#fafafa] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[760px] px-5 text-center md:px-8">
        <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#12151b] md:text-4xl">
          Newsletter <span className="text-gold-gradient">M2 News</span>
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#3b3f47] md:text-base">
          Receba as ultimas noticias e insights sobre recuperacao de credito, compliance fiscal, holding e reforma tributaria.
        </p>

        {submitted ? (
          <p className="mt-8 text-sm font-semibold text-[#12151b]">
            Obrigado! Em breve voce recebera nossos insights.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu.email@empresa.com.br"
              className="h-12 flex-1 rounded-none border-zinc-300 bg-white text-sm text-[#12151b] placeholder:text-zinc-400 focus-visible:border-[#c9a84c] focus-visible:ring-[#c9a84c]/25"
              aria-label="E-mail corporativo"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center bg-gold-gradient px-8 text-sm font-black uppercase tracking-wide text-[#0a0f16] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enviando..." : "Assinar"}
            </button>
          </form>
        )}

        {errorMessage ? (
          <p className="mt-4 text-sm font-semibold text-red-700">{errorMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
