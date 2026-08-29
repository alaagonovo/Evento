import { describe, expect, it } from "vitest";
import { duplicateEmailErrorKey, getAuthErrorMessage } from "./auth-errors";

describe("getAuthErrorMessage", () => {
  it("maps an already-registered signup to a taken-email error", () => {
    expect(getAuthErrorMessage("User already registered")).toBe("emailTaken");
  });
});

describe("duplicateEmailErrorKey", () => {
  it("uses the vendor-specific copy when signing up as a vendor", () => {
    expect(duplicateEmailErrorKey("vendor")).toBe("emailTakenVendor");
    expect(duplicateEmailErrorKey("customer")).toBe("emailTaken");
  });
});
