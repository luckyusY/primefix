import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — PrimeFix London",
};

// Completely isolated layout — no Navbar, Footer, or site chrome
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
