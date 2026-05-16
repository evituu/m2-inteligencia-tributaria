"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const serviceOptions = [
  "Contribuição Previdenciária Patronal (INSS)",
  "Exclusão do ICMS do PIS/COFINS",
  "PIS/COFINS sobre Despesas Essenciais",
  "Produtos Monofásicos (Simples Nacional)",
  "Posto de Combustível — PIS/COFINS sobre Diesel",
  "Posto de Combustível — Evaporação",
  "Ainda não sei / quero uma análise geral",
] as const;

const challengeOptions = [
  "Não sei se tenho direito a créditos",
  "Já sei que tenho direito, mas preciso formalizar",
  "Quero compensar tributos futuros",
  "Preciso de liquidez (restituição em dinheiro)",
  "Meu contador identificou uma oportunidade",
  "Outro",
] as const;

const taxRegimeOptions = [
  "Lucro Real",
  "Lucro Presumido",
  "Simples Nacional",
  "Não sei",
] as const;

const leadQualificationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Informe seu nome.")
    .max(120, "O nome completo deve ter no máximo 120 caracteres."),
  companyName: z
    .string()
    .trim()
    .min(1, "Informe o nome da empresa.")
    .max(120, "O nome da empresa deve ter no máximo 120 caracteres."),
  cnpj: z
    .string()
    .trim()
    .min(1, "Informe o CNPJ.")
    .refine((value) => value.replace(/\D/g, "").length === 14, "Informe um CNPJ válido."),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Informe um WhatsApp válido.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }, "Informe um WhatsApp válido."),
  professionalEmail: z.string().trim().email("Informe um e-mail válido."),
  taxRegime: z.string().min(1, "Selecione uma opção."),
  service: z.string().min(1, "Selecione uma opção."),
  challenge: z.string().min(1, "Selecione uma opção."),
  needDetails: z
    .string()
    .trim()
    .max(300, "A descrição deve ter no máximo 300 caracteres.")
    .optional(),
});

type LeadQualificationFormData = z.infer<typeof leadQualificationSchema>;

const dropdownTriggerClasses =
  "h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function maskCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function LeadQualificationForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadQualificationFormData>({
    resolver: zodResolver(leadQualificationSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      cnpj: "",
      whatsapp: "",
      professionalEmail: "",
      taxRegime: "",
      service: "",
      challenge: "",
      needDetails: "",
    },
    mode: "onBlur",
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 700));
    reset();
  }

  return (
    <Card className="border border-zinc-200 bg-white py-0 shadow-xl">
      <CardHeader className="border-b border-zinc-100 px-6 py-5 md:px-7">
        <CardTitle className="text-center text-2xl font-extrabold text-black md:text-3xl">
          FORMULÁRIO
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 py-6 md:px-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nome completo *</Label>
            <Input
              id="fullName"
              placeholder="Digite seu nome"
              maxLength={120}
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="companyName">Nome da empresa *</Label>
            <Input
              id="companyName"
              placeholder="Digite o nome da empresa"
              maxLength={120}
              aria-invalid={Boolean(errors.companyName)}
              {...register("companyName")}
            />
            {errors.companyName ? (
              <p className="text-xs text-destructive">{errors.companyName.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0001-00"
                inputMode="numeric"
                maxLength={18}
                aria-invalid={Boolean(errors.cnpj)}
                {...register("cnpj", {
                  onChange: (event) =>
                    setValue("cnpj", maskCnpj(event.target.value), {
                      shouldValidate: true,
                    }),
                })}
              />
              {errors.cnpj ? (
                <p className="text-xs text-destructive">{errors.cnpj.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                placeholder="(88) 99999-9999"
                aria-invalid={Boolean(errors.whatsapp)}
                {...register("whatsapp")}
              />
              {errors.whatsapp ? (
                <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="professionalEmail">E-mail *</Label>
            <Input
              id="professionalEmail"
              type="email"
              placeholder="voce@empresa.com.br"
              aria-invalid={Boolean(errors.professionalEmail)}
              {...register("professionalEmail")}
            />
            {errors.professionalEmail ? (
              <p className="text-xs text-destructive">
                {errors.professionalEmail.message}
              </p>
            ) : null}
          </div>

          <DropdownField
            name="taxRegime"
            label="Regime tributário *"
            options={taxRegimeOptions}
            control={control}
            error={errors.taxRegime?.message}
          />

          <DropdownField
            name="service"
            label="Qual serviço você procura? *"
            options={serviceOptions}
            control={control}
            error={errors.service?.message}
          />

          <DropdownField
            name="challenge"
            label="Qual é o principal desafio da sua empresa hoje? *"
            options={challengeOptions}
            control={control}
            error={errors.challenge?.message}
          />

          <div className="space-y-1.5">
            <Label htmlFor="needDetails">Conte brevemente sobre sua necessidade</Label>
            <Textarea
              id="needDetails"
              placeholder="Descreva em poucas linhas o cenário atual da sua empresa."
              maxLength={300}
              className="min-h-24"
              {...register("needDetails")}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gold-gradient h-11 w-full text-sm font-black uppercase tracking-wide text-[#0a0f16] transition-all duration-300 hover:brightness-105"
          >
            {isSubmitting ? "Enviando..." : "Solicitar análise gratuita"}
          </Button>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-zinc-500">
            <Lock className="h-3.5 w-3.5" />
            Seus dados são tratados com confidencialidade, conforme a LGPD.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function DropdownField({
  name,
  label,
  options,
  control,
  error,
}: {
  name: "taxRegime" | "service" | "challenge";
  label: string;
  options: readonly string[];
  control: ReturnType<typeof useForm<LeadQualificationFormData>>["control"];
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  dropdownTriggerClasses,
                  "inline-flex items-center justify-between gap-3",
                  error ? "border-destructive ring-3 ring-destructive/20" : "",
                  !field.value ? "text-muted-foreground" : "text-foreground"
                )}
              >
                <span className="truncate">{field.value || "Selecione uma opção"}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuRadioGroup
                value={field.value}
                onValueChange={field.onChange}
              >
                {options.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {option}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
