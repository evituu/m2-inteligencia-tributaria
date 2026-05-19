import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().email(),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
