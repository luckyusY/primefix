import Services from "@/components/Services";
import Projects from "@/components/Projects";
import HowItWorks from "@/components/HowItWorks";
import CtaBanner from "@/components/CtaBanner";
import PageHero from "@/components/PageHero";
import BookingButton from "@/components/BookingButton";

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Home repair, appliance support, and specialist domestic help"
        description="Explore the core services PrimeFix London delivers for households across the city, from urgent repair needs to planned support visits."
      >
        <BookingButton className="btn btn-teal">Book Appointment</BookingButton>
        <a href="tel:+447507113805" className="btn btn-outline page-hero__call">
          Call +44 7507 113805
        </a>
      </PageHero>
      <Services />
      <HowItWorks />
      <Projects />
      <CtaBanner />
    </main>
  );
}
