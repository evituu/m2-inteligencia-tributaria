import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  companyName: z.string().trim().min(1).max(120),
  cnpj: z
    .string()
    .trim()
    .min(1)
    .refine((value) => value.replace(/\D/g, "").length === 14, "CNPJ invalido"),
  whatsapp: z
    .string()
    .trim()
    .min(1)
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }, "WhatsApp invalido"),
  professionalEmail: z.string().trim().email(),
  taxRegime: z.string().trim().min(1),
  service: z.string().trim().min(1),
  challenge: z.string().trim().min(1),
  needDetails: z.string().trim().max(300).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
