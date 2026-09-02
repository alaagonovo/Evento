import { v2 as cloudinary } from "cloudinary";

const FOLDERS = {
  profile: "evento/profiles",
  "vendor-cover": "evento/vendors/cover",
  "vendor-gallery": "evento/vendors/gallery",
} as const;

export type UploadFolder = keyof typeof FOLDERS;

export function isUploadFolder(value: string): value is UploadFolder {
  return value in FOLDERS;
}

export function cloudinaryFolder(folder: UploadFolder) {
  return FOLDERS[folder];
}

export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export type CloudinaryResourceType = "image" | "video";

export function isCloudinaryImageUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export function cloudinaryAssetFromUrl(url: string) {
  if (!isCloudinaryImageUrl(url)) return null;

  const pathname = new URL(url).pathname;
  const match = pathname.match(/\/(image|video)\/upload\/(.+)$/);
  if (!match?.[1] || !match[2]) return null;

  const resourceType = match[1] as CloudinaryResourceType;
  const parts = match[2].split("/").filter(Boolean);
  while (parts[0] && (parts[0].includes(",") || /^v\d+$/.test(parts[0]))) {
    parts.shift();
  }

  if (parts.length === 0) return null;

  const last = parts[parts.length - 1] ?? "";
  parts[parts.length - 1] = last.replace(/\.[a-z0-9]+$/i, "");
  const publicId = parts.join("/");

  if (!Object.values(FOLDERS).some((folder) => publicId.startsWith(`${folder}/`))) {
    return null;
  }

  return { publicId, resourceType };
}

export function cloudinaryPublicIdFromUrl(url: string) {
  return cloudinaryAssetFromUrl(url)?.publicId ?? null;
}
