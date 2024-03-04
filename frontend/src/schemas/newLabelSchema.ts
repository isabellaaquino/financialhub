import { z } from "zod";

export const newLabelFormSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character long."),
  color: z.string(),
});

export type NewLabelFormData = z.infer<typeof newLabelFormSchema>;
