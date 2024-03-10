import { z } from "zod";

export const editBalanceFormSchema = z.object({
  balance: z.string().transform((value) => {
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  }),
});

export type EditBalanceFormData = z.infer<typeof editBalanceFormSchema>;
