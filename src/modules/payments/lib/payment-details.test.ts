import { describe, expect, it } from "vitest";
import {
  cvcOk,
  expiryOk,
  formatCardNumber,
  luhnOk,
  walletPhoneOk,
} from "./payment-details";

describe("payment details", () => {
  it("formats and validates a Visa test card", () => {
    expect(formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(luhnOk("4111 1111 1111 1111")).toBe(true);
    expect(luhnOk("4111111111111112")).toBe(false);
  });

  it("rejects expired cards", () => {
    expect(expiryOk("12/99")).toBe(true);
    expect(expiryOk("01/20", new Date(2026, 0, 1))).toBe(false);
    expect(cvcOk("123")).toBe(true);
    expect(cvcOk("12")).toBe(false);
  });

  it("accepts wallet mobile numbers", () => {
    expect(walletPhoneOk("01012345678")).toBe(true);
    expect(walletPhoneOk("+20 101 234 5678")).toBe(true);
    expect(walletPhoneOk("123")).toBe(false);
  });
});
