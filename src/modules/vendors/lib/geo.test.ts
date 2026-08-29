import { describe, expect, it } from "vitest";
import { formatDistanceKm, haversineKm } from "./geo";

describe("haversineKm", () => {
  it("measures Cairo to Giza as a short drive", () => {
    const km = haversineKm(
      { latitude: 30.0444, longitude: 31.2357 },
      { latitude: 30.0131, longitude: 31.2089 },
    );
    expect(km).toBeGreaterThan(3);
    expect(km).toBeLessThan(8);
  });
});

describe("formatDistanceKm", () => {
  it("uses meters under one kilometer", () => {
    expect(formatDistanceKm(0.42, "en")).toBe("420 m");
    expect(formatDistanceKm(0.42, "ar")).toBe("420 م");
  });

  it("uses kilometers from one kilometer up", () => {
    expect(formatDistanceKm(4.2, "en")).toBe("4.2 km");
    expect(formatDistanceKm(18.4, "en")).toBe("18 km");
  });
});
