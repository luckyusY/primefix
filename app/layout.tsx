import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrimeFix London - Property Maintenance & Repairs",
  description:
    "PrimeFix London provides property maintenance and repair services across London, including general repairs, plumbing, electrical, heating, and specialist call-outs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
