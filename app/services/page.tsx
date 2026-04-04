import Services from "@/components/Services";
import CtaBanner from "@/components/CtaBanner";
import PageHero from "@/components/PageHero";
import BookingButton from "@/components/BookingButton";
import ServicesOverview from "@/components/ServicesOverview";

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Domestic appliance guard for London homes"
        description="PrimeFix London covers home repair and maintenance, plumbing, electrical and heating repairs, appliance repairs, drainage, locksmith, window repairs, and pest control services."
      >
        <BookingButton className="btn btn-teal">Book Appointment</BookingButton>
        <a href="tel:+447507113805" className="btn btn-outline page-hero__call">
          Call +44 7507 113805
        </a>
      </PageHero>
      <ServicesOverview />
      <Services />
      <CtaBanner />
    </main>
  );
}
