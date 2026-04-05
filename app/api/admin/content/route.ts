import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminToken } from "@/lib/auth";
import { getContent, setSection } from "@/lib/content";
import type { ContentKey } from "@/lib/types";

function isAuthed(): boolean {
  const token = cookies().get("pf_admin")?.value;
  return !!token && token === getAdminToken();
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, value } = await req.json() as { key: ContentKey; value: unknown };
  const allowed: ContentKey[] = ["reviews", "faqs", "steps", "projects"];
  if (!allowed.includes(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    await setSection(key, value as never);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
