/**
 * Public API for the auth module.
 * Import only from `@/modules/auth`.
 */
export { AuthCard } from "./components/auth-card";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { SignInForm } from "./components/sign-in-form";
export { SignOutButton } from "./components/sign-out-button";
export { SignUpForm } from "./components/sign-up-form";
export { UpdatePasswordForm } from "./components/update-password-form";
export { getPostAuthPath } from "./services/redirect";
export type { IntendedRole } from "./types/auth";
