"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export function BlogNewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-[#fafafa] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[760px] px-5 text-center md:px-8">
        <span className="mx-auto mb-4 block h-1.5 w-14 bg-[#f2c40f]" />
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#12151b] md:text-4xl">
          Newsletter <span className="text-gold-gradient">M2 News</span>
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#3b3f47] md:text-base">
          Receba as últimas notícias e insights sobre recuperação de crédito, compliance fiscal, holding e reforma tributária.
        </p>

        {submitted ? (
          <p className="mt-8 text-sm font-semibold text-[#12151b]">
            Obrigado! Em breve você receberá nossos insights.
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
              className="inline-flex h-12 items-center justify-center bg-gold-gradient px-8 text-sm font-black uppercase tracking-wide text-[#0a0f16] transition-all hover:brightness-105"
            >
              Assinar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
