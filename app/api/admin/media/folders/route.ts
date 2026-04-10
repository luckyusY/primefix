import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAdminToken } from "@/lib/auth";
import { createCloudinaryFolder } from "@/lib/cloudinary-admin";
import { hasCloudinaryConfig } from "@/lib/cloudinary";
import { normalizeMediaFolder } from "@/lib/media";

export const runtime = "nodejs";

function isAuthed(): boolean {
  const token = cookies().get("pf_admin")?.value;
  return !!token && token === getAdminToken();
}

export async function POST(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 },
    );
  }

  const body = (await req.json()) as { folder?: string };
  const folder =
    typeof body.folder === "string" ? normalizeMediaFolder(body.folder) : "";

  if (!folder) {
    return NextResponse.json(
      { error: "Enter a folder name first." },
      { status: 400 },
    );
  }

  try {
    const result = await createCloudinaryFolder(folder);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create folder.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
