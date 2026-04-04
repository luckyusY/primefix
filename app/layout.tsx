import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFloat from "@/components/ContactFloat";
import CookieConsent from "@/components/CookieConsent";
import { BookingProvider } from "@/components/BookingProvider";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrimeFix London - Domestic Appliance Guard & Home Repairs",
  description:
    "PrimeFix London delivers domestic appliance guard support, home repairs, plumbing, electrical, heating, appliance, drainage, locksmith, window and pest control services across London.",
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
      <body>
        <SmoothScroll />
        <BookingProvider>
          <Navbar />
          {children}
          <Footer />
          <ContactFloat />
          <CookieConsent />
        </BookingProvider>
      </body>
    </html>
  );
}
