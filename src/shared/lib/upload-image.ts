import type { UploadFolder } from "./cloudinary";
import { isVideoFile } from "./media";

export function uploadLocalImage(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return uploadLocalFile(file, folder, onProgress);
}

export function uploadLocalFile(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<string> {
  if (isVideoFile(file)) {
    return uploadVideoDirect(file, folder, onProgress);
  }

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.set("file", file);
    form.set("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    bindXhr(xhr, onProgress, resolve, reject, (payload) => payload?.url);
    xhr.send(form);
  });
}

async function uploadVideoDirect(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const signed = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, resourceType: "video" }),
  });
  const credentials = (await signed.json().catch(() => null)) as {
    timestamp?: number;
    signature?: string;
    apiKey?: string;
    cloudName?: string;
    folder?: string;
    error?: string;
  } | null;

  if (
    !signed.ok ||
    !credentials?.timestamp ||
    !credentials.signature ||
    !credentials.apiKey ||
    !credentials.cloudName ||
    !credentials.folder
  ) {
    throw new Error(credentials?.error ?? "Upload failed");
  }

  const { timestamp, signature, apiKey, cloudName, folder: signedFolder } = credentials;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.set("file", file);
    form.set("api_key", apiKey);
    form.set("timestamp", String(timestamp));
    form.set("signature", signature);
    form.set("folder", signedFolder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${credentials.cloudName}/video/upload`);
    bindXhr(xhr, onProgress, resolve, reject, (payload) => payload?.secure_url ?? payload?.url);
    xhr.send(form);
  });
}

export async function deleteCloudinaryImage(url: string) {
  if (!url) return;

  try {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Best-effort: the form should still update if Cloudinary delete fails.
  }
}

function bindXhr(
  xhr: XMLHttpRequest,
  onProgress: ((percent: number) => void) | undefined,
  resolve: (url: string) => void,
  reject: (error: Error) => void,
  readUrl: (payload: { url?: string; secure_url?: string; error?: string } | null) => string | undefined,
) {
  xhr.upload.onprogress = (event) => {
    if (!event.lengthComputable || event.total === 0) return;
    const percent = Math.round((event.loaded / event.total) * 100);
    onProgress?.(Math.min(99, percent));
  };

  xhr.onload = () => {
    const payload = parsePayload(xhr.responseText);
    const url = readUrl(payload);
    if (xhr.status >= 200 && xhr.status < 300 && url) {
      onProgress?.(100);
      resolve(url);
      return;
    }
    reject(new Error(payload?.error ?? "Upload failed"));
  };

  xhr.onerror = () => reject(new Error("Upload failed"));
  xhr.onabort = () => reject(new Error("Upload failed"));
}

function parsePayload(raw: string): { url?: string; secure_url?: string; error?: string } | null {
  try {
    return JSON.parse(raw) as { url?: string; secure_url?: string; error?: string };
  } catch {
    return null;
  }
}
