import { describe, expect, it } from "vitest";
import {
  googleMapsSearchUrl,
  isGoogleMapsLink,
  parseGoogleMapsCoords,
} from "./parse-google-maps-location";

describe("parseGoogleMapsCoords", () => {
  it("reads @lat,lng from a place URL", () => {
    expect(
      parseGoogleMapsCoords(
        "https://www.google.com/maps/place/Zamalek/@30.0616,31.2194,16z",
      ),
    ).toEqual({ latitude: 30.0616, longitude: 31.2194 });
  });

  it("prefers the pin coordinates over the camera position", () => {
    expect(
      parseGoogleMapsCoords(
        "https://www.google.com/maps/place/Foo/@30.1,31.1,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d30.0444!4d31.2357",
      ),
    ).toEqual({ latitude: 30.0444, longitude: 31.2357 });
  });

  it("reads q=lat,lng", () => {
    expect(parseGoogleMapsCoords("https://maps.google.com/?q=30.0444,31.2357")).toEqual({
      latitude: 30.0444,
      longitude: 31.2357,
    });
  });

  it("reads a Maps search API link", () => {
    expect(
      parseGoogleMapsCoords(
        "https://www.google.com/maps/search/?api=1&query=30.0444,31.2357",
      ),
    ).toEqual({ latitude: 30.0444, longitude: 31.2357 });
  });

  it("returns null when the link has no coordinates", () => {
    expect(parseGoogleMapsCoords("https://www.google.com/maps")).toBeNull();
  });

  it("returns null for a non-Maps URL", () => {
    expect(parseGoogleMapsCoords("https://example.com/?q=30.0444,31.2357")).toBeNull();
  });
});

describe("isGoogleMapsLink", () => {
  it("accepts google.com/maps and short Maps links", () => {
    expect(isGoogleMapsLink("https://www.google.com/maps/place/Cairo")).toBe(true);
    expect(isGoogleMapsLink("https://maps.app.goo.gl/abc123")).toBe(true);
  });

  it("rejects unrelated URLs", () => {
    expect(isGoogleMapsLink("https://images.unsplash.com/photo-one")).toBe(false);
  });
});

describe("googleMapsSearchUrl", () => {
  it("builds a Google Maps pin link from coordinates", () => {
    expect(googleMapsSearchUrl(30.0616, 31.2194)).toBe(
      "https://www.google.com/maps?q=30.0616,31.2194",
    );
  });
});
