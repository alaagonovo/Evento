export type AuthErrorKey =
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "emailTaken"
  | "emailTakenVendor"
  | "networkError"
  | "genericError";

export function getAuthErrorMessage(message: string): AuthErrorKey {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login") ||
    lower.includes("invalid credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "invalidCredentials";
  }

  if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
    return "emailNotConfirmed";
  }

  if (
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already exists") ||
    lower.includes("email address is already")
  ) {
    return "emailTaken";
  }

  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("fetch failed")) {
    return "networkError";
  }

  return "genericError";
}

export function duplicateEmailErrorKey(intendedRole: "customer" | "vendor"): "emailTaken" | "emailTakenVendor" {
  return intendedRole === "vendor" ? "emailTakenVendor" : "emailTaken";
}
