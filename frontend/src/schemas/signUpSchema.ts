import { z } from "zod";

export const signUpFormSchema = z.object({
  firstName: z.string().min(1, "Invalid email"),
  lastName: z.string().min(1, "Invalid password"),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
