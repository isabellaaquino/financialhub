import { z } from "zod";

export const editBalanceFormSchema = z.object({
  balance: z.coerce.number(),
});

export type EditBalanceFormData = z.infer<typeof editBalanceFormSchema>;
