import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Logout
  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("pf_admin", "", { maxAge: 0, path: "/" });
    return res;
  }

  // Login
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pf_admin", getAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}
