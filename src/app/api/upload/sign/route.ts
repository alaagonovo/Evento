import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/server";
import { cloudinaryFolder, getCloudinary, isUploadFolder } from "@/shared/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    folder?: string;
    resourceType?: string;
  } | null;

  if (!body?.folder || !isUploadFolder(body.folder) || body.folder !== "vendor-gallery") {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  if (body.resourceType !== "video") {
    return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = cloudinaryFolder(body.folder);
  const cloudinary = getCloudinary();
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, cloudinary.config().api_secret ?? "");

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key,
    cloudName: cloudinary.config().cloud_name,
    folder,
  });
}
