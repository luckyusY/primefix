import { cookies } from "next/headers";
import { getAdminToken } from "@/lib/auth";
import { getContent } from "@/lib/content";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const token = cookies().get("pf_admin")?.value;
  const isAuthenticated = !!token && token === getAdminToken();
  const content = isAuthenticated ? await getContent() : null;

  return <AdminClient isAuthenticated={isAuthenticated} initialContent={content} />;
}
