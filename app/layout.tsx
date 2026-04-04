import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFloat from "@/components/ContactFloat";
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
        </BookingProvider>
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              Tawk_API.customStyle = {
                visibility: {
                  desktop: { position: 'br', xOffset: 20, yOffset: 20 },
                  mobile:  { position: 'br', xOffset: 10, yOffset: 10 }
                }
              };
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69d172a5b8aa781c3b31044d/1jld2fnpb';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
