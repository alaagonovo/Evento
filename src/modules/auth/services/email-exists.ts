type EmailExistsClient = {
  rpc: (
    fn: "email_exists",
    args: { check_email: string },
  ) => PromiseLike<{ data: boolean | null; error: { message: string } | null }>;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isDuplicateSignUpUser(user: { identities?: unknown[] | null } | null | undefined) {
  return Array.isArray(user?.identities) && user.identities.length === 0;
}

export async function checkEmailExists(
  supabase: EmailExistsClient,
  email: string,
): Promise<boolean | "unknown"> {
  const check_email = normalizeEmail(email);
  if (!check_email) return false;

  const { data, error } = await supabase.rpc("email_exists", { check_email });
  if (error) {
    return "unknown";
  }

  return Boolean(data);
}
