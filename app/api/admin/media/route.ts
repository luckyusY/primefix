import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAdminToken } from "@/lib/auth";
import { listCloudinaryImages, uploadCloudinaryImage } from "@/lib/cloudinary-admin";
import { hasCloudinaryConfig } from "@/lib/cloudinary";
import { DEFAULT_PROJECT_MEDIA_FOLDER, normalizeMediaFolder } from "@/lib/media";

export const runtime = "nodejs";

function isAuthed(): boolean {
  const token = cookies().get("pf_admin")?.value;
  return !!token && token === getAdminToken();
}

function ensureCloudinary() {
  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 },
    );
  }

  return null;
}

export async function GET(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudinaryResponse = ensureCloudinary();
  if (cloudinaryResponse) return cloudinaryResponse;

  const folder = normalizeMediaFolder(
    req.nextUrl.searchParams.get("folder") ?? DEFAULT_PROJECT_MEDIA_FOLDER,
  );
  const nextCursor = req.nextUrl.searchParams.get("next_cursor") ?? undefined;

  try {
    const payload = await listCloudinaryImages({ folder, nextCursor });
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load media library.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudinaryResponse = ensureCloudinary();
  if (cloudinaryResponse) return cloudinaryResponse;

  const form = await req.formData();
  const uploaded = form.get("file");
  const folderEntry = form.get("folder");
  const folder = normalizeMediaFolder(
    typeof folderEntry === "string"
      ? folderEntry
      : DEFAULT_PROJECT_MEDIA_FOLDER,
  );

  if (!(uploaded instanceof File) || uploaded.size === 0) {
    return NextResponse.json(
      { error: "Choose an image file to upload." },
      { status: 400 },
    );
  }

  if (!uploaded.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are supported." },
      { status: 400 },
    );
  }

  try {
    const asset = await uploadCloudinaryImage(uploaded, { folder });
    return NextResponse.json({ asset, folder });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload image.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
