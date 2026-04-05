import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFloat from "@/components/ContactFloat";
import CookieConsentInit from "@/components/CookieConsentInit";
import { BookingProvider } from "@/components/BookingProvider";
import SmoothScroll from "@/components/SmoothScroll";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <CookieConsentInit />
      <BookingProvider>
        <Navbar />
        {children}
        <Footer />
        <ContactFloat />
      </BookingProvider>
    </>
  );
}
