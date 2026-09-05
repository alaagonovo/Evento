import { describe, expect, it } from "vitest";
import { isBeforeMinBookableDate, minBookableDate } from "./booking-notice";

describe("booking notice window", () => {
  const now = new Date(2026, 8, 4, 12, 0, 0);

  it("requires 3 days of notice, matching search", () => {
    expect(minBookableDate(now)).toBe("2026-09-07");
  });

  it("treats today and the next two days as unavailable", () => {
    expect(isBeforeMinBookableDate("2026-09-04", now)).toBe(true);
    expect(isBeforeMinBookableDate("2026-09-05", now)).toBe(true);
    expect(isBeforeMinBookableDate("2026-09-06", now)).toBe(true);
    expect(isBeforeMinBookableDate("2026-09-07", now)).toBe(false);
  });
});
