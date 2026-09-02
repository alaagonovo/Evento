import { describe, expect, it } from "vitest";
import { countImageUrls, countVideoUrls, isVideoUrl } from "./media";

describe("gallery media helpers", () => {
  it("detects Cloudinary and file-extension videos", () => {
    expect(
      isVideoUrl("https://res.cloudinary.com/demo/video/upload/v1/evento/vendors/gallery/clip.mp4"),
    ).toBe(true);
    expect(isVideoUrl("https://cdn.example.com/tour.webm")).toBe(true);
    expect(
      isVideoUrl("https://res.cloudinary.com/demo/image/upload/v1/evento/vendors/gallery/photo.jpg"),
    ).toBe(false);
  });

  it("counts images and videos separately", () => {
    const urls = [
      "https://example.com/a.jpg",
      "https://res.cloudinary.com/demo/video/upload/v1/evento/vendors/gallery/clip.mp4",
      "https://example.com/b.png",
    ];
    expect(countVideoUrls(urls)).toBe(1);
    expect(countImageUrls(urls)).toBe(2);
  });
});
