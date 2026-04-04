import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpKeep UK - Property Maintenance & Construction",
  description:
    "From emergency repairs to full refurbishments, UpKeep UK delivers trusted property maintenance, construction, and refurbishment services across London.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
