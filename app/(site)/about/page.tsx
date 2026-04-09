import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Accreditations from "@/components/Accreditations";
import CtaBanner from "@/components/CtaBanner";
import PageHero from "@/components/PageHero";
import BookingButton from "@/components/BookingButton";

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About"
        title="A simpler and more reliable way to handle home repair needs"
        description="PrimeFix Hub is designed to help households move from first enquiry to confirmed visit and after-service support with less friction and clearer communication."
      >
        <BookingButton className="btn btn-teal">Book Appointment</BookingButton>
      </PageHero>
      <About />
      <Accreditations />
      <Reviews />
      <CtaBanner />
    </main>
  );
}
