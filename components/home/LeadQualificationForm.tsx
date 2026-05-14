"use client";

import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";

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
  "Recuperação de crédito",
  "Cobrança extrajudicial",
  "Negociação de débitos",
  "Análise de carteira inadimplente",
  "Consultoria para redução de inadimplência",
  "Inteligência tributária",
  "Ainda não sei",
] as const;

const challengeOptions = [
  "Clientes inadimplentes",
  "Dificuldade para negociar débitos",
  "Alto volume de cobranças em aberto",
  "Falta de processo para recuperação de crédito",
  "Necessidade de análise da carteira",
  "Outro",
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
  whatsapp: z
    .string()
    .trim()
    .min(1, "Informe um WhatsApp válido.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }, "Informe um WhatsApp válido."),
  professionalEmail: z
    .string()
    .trim()
    .email("Informe um e-mail válido."),
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
  "h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

export function LeadQualificationForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadQualificationFormData>({
    resolver: zodResolver(leadQualificationSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      whatsapp: "",
      professionalEmail: "",
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
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 99999-9999"
                aria-invalid={Boolean(errors.whatsapp)}
                {...register("whatsapp")}
              />
              {errors.whatsapp ? (
                <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="professionalEmail">E-mail*</Label>
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service">Qual serviço você procura? *</Label>
            <Controller
              name="service"
              control={control}
              render={({ field }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-invalid={Boolean(errors.service)}
                      className={cn(
                        dropdownTriggerClasses,
                        "inline-flex items-center justify-between",
                        !field.value ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      <span>{field.value || "Selecione uma opção"}</span>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72">
                    <DropdownMenuRadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {serviceOptions.map((option) => (
                        <DropdownMenuRadioItem key={option} value={option}>
                          {option}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
            {errors.service ? (
              <p className="text-xs text-destructive">{errors.service.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="challenge">
              Qual é o principal desafio da sua empresa hoje? *
            </Label>
            <Controller
              name="challenge"
              control={control}
              render={({ field }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-invalid={Boolean(errors.challenge)}
                      className={cn(
                        dropdownTriggerClasses,
                        "inline-flex items-center justify-between",
                        !field.value ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      <span>{field.value || "Selecione uma opção"}</span>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72">
                    <DropdownMenuRadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {challengeOptions.map((option) => (
                        <DropdownMenuRadioItem key={option} value={option}>
                          {option}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
            {errors.challenge ? (
              <p className="text-xs text-destructive">{errors.challenge.message}</p>
            ) : null}
          </div>

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
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
