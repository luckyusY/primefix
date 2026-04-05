import { createHmac } from "crypto";

export function getAdminToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? "changeme";
  return createHmac("sha256", secret).update("primefix-admin").digest("hex");
}
