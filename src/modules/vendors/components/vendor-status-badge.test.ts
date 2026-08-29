import { describe, expect, it } from "vitest";
import { vendorStatusLabel } from "./vendor-status-badge";
import { en } from "@/shared/lib/i18n/en";

describe("vendorStatusLabel", () => {
  it("maps each vendor status to its admin label", () => {
    expect(vendorStatusLabel("pending", en)).toBe("Pending");
    expect(vendorStatusLabel("approved", en)).toBe("Approved");
    expect(vendorStatusLabel("rejected", en)).toBe("Rejected");
    expect(vendorStatusLabel("suspended", en)).toBe("Suspended");
  });
});
