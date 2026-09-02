import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";
import {
  cloudinaryAssetFromUrl,
  cloudinaryFolder,
  getCloudinary,
  isUploadFolder,
} from "@/shared/lib/cloudinary";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/shared/lib/upload-limits";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set<string>(ALLOWED_IMAGE_TYPES);

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const folderValue = String(form.get("folder") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!isUploadFolder(folderValue)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image is too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinary = getCloudinary();

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: cloudinaryFolder(folderValue),
            resource_type: "image",
            overwrite: false,
          },
          (error, uploaded) => {
            if (error || !uploaded?.secure_url) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve({ secure_url: uploaded.secure_url });
          },
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  const asset = body?.url ? cloudinaryAssetFromUrl(body.url) : null;

  if (!asset) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    await getCloudinary().uploader.destroy(asset.publicId, {
      resource_type: asset.resourceType,
      invalidate: true,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
