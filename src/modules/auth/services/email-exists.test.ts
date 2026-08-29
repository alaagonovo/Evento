import { describe, expect, it, vi } from "vitest";
import { checkEmailExists, isDuplicateSignUpUser, normalizeEmail } from "./email-exists";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Alaa@Gonovo.tech ")).toBe("alaa@gonovo.tech");
  });
});

describe("isDuplicateSignUpUser", () => {
  it("treats an empty identities array as an existing account", () => {
    expect(isDuplicateSignUpUser({ identities: [] })).toBe(true);
  });

  it("allows a real new identity", () => {
    expect(isDuplicateSignUpUser({ identities: [{ id: "1" }] })).toBe(false);
  });
});

describe("checkEmailExists", () => {
  it("returns true for a registered email", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    await expect(checkEmailExists({ rpc }, "taken@evento.app")).resolves.toBe(true);
    expect(rpc).toHaveBeenCalledWith("email_exists", { check_email: "taken@evento.app" });
  });

  it("returns false for a fresh email", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: false, error: null });
    await expect(checkEmailExists({ rpc }, "new@evento.app")).resolves.toBe(false);
  });

  it("returns unknown when the RPC is unavailable", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "function missing" } });
    await expect(checkEmailExists({ rpc }, "anyone@evento.app")).resolves.toBe("unknown");
  });
});
