import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().min(1, "Invalid email"),
  password: z.string().min(1, "Invalid password"),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
