import { z } from "zod";

export const newLabelFormSchema = z.object({
  name: z.string().min(1, "Invalid email"),
  color: z.string().default("#000000"),
});

export type NewLabelFormData = z.infer<typeof newLabelFormSchema>;
