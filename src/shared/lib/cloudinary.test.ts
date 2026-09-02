import { describe, expect, it } from "vitest";
import { cloudinaryPublicIdFromUrl, isCloudinaryImageUrl, isUploadFolder } from "./cloudinary";

describe("cloudinary helpers", () => {
  it("accepts only known upload folders", () => {
    expect(isUploadFolder("profile")).toBe(true);
    expect(isUploadFolder("vendor-cover")).toBe(true);
    expect(isUploadFolder("vendor-gallery")).toBe(true);
    expect(isUploadFolder("other")).toBe(false);
  });

  it("accepts Cloudinary image URLs", () => {
    expect(
      isCloudinaryImageUrl("https://res.cloudinary.com/o1as1fry/image/upload/v1/evento/profiles/a.jpg"),
    ).toBe(true);
    expect(isCloudinaryImageUrl("https://images.unsplash.com/photo-example")).toBe(false);
    expect(isCloudinaryImageUrl("not-a-url")).toBe(false);
  });

  it("extracts public ids only for Evento upload folders", () => {
    expect(
      cloudinaryPublicIdFromUrl(
        "https://res.cloudinary.com/demo/image/upload/v1710000000/evento/profiles/abc123.jpg",
      ),
    ).toBe("evento/profiles/abc123");
    expect(
      cloudinaryPublicIdFromUrl(
        "https://res.cloudinary.com/demo/image/upload/c_fill,w_800/v1/evento/vendors/cover/cover-id.webp",
      ),
    ).toBe("evento/vendors/cover/cover-id");
    expect(
      cloudinaryPublicIdFromUrl(
        "https://res.cloudinary.com/demo/image/upload/evento/vendors/gallery/photo.png",
      ),
    ).toBe("evento/vendors/gallery/photo");
    expect(
      cloudinaryPublicIdFromUrl("https://res.cloudinary.com/demo/image/upload/v1/other/folder/x.jpg"),
    ).toBeNull();
    expect(
      cloudinaryPublicIdFromUrl(
        "https://res.cloudinary.com/demo/video/upload/v1710000000/evento/vendors/gallery/clip.mp4",
      ),
    ).toBe("evento/vendors/gallery/clip");
  });
});
