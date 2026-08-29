import { describe, expect, it } from "vitest";
import { getInitials } from "./user-avatar";

describe("getInitials", () => {
  it("uses the first letters of the first and last names", () => {
    expect(getInitials("Alaa Hassan")).toBe("AH");
  });

  it("falls back to two letters from a single name", () => {
    expect(getInitials("Evento")).toBe("EV");
  });
});
