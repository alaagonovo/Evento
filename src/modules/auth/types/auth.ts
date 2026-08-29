import { z } from "zod";

export const intendedRoleSchema = z.enum(["customer", "vendor"]);

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  intendedRole: intendedRoleSchema,
});

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8).max(72),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type IntendedRole = z.infer<typeof intendedRoleSchema>;
