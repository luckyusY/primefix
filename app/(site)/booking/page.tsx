import BookingButton from "@/components/BookingButton";
import BookingForm from "@/components/BookingForm";
import HowItWorks from "@/components/HowItWorks";
import PageHero from "@/components/PageHero";

const BOOKING_POINTS = [
  "Choose a preferred appointment date and time",
  "Tell us the service type and property location",
  "Share repair details before the technician arrives",
  "Get a clear confirmation after we review the request",
];

export default function BookingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Booking"
        title="Book an appointment with PrimeFix Hub"
        description="Use the booking page to request the visit you need, or open the popup if you prefer a faster booking flow from anywhere on the site."
      >
        <BookingButton className="btn btn-teal">Open Booking Popup</BookingButton>
        <a href="tel:+447507113805" className="btn btn-outline page-hero__call">
          Call +44 7507 113805
        </a>
      </PageHero>

      <section className="booking-page">
        <div className="container booking-page__grid">
          <div className="booking-page__copy">
            <span className="label">What To Expect</span>
            <h2>Make your booking in one clear step</h2>
            <div className="divider"></div>
            <p>
              This page is focused on appointment requests only. Share the key
              details once and PrimeFix Hub will confirm the best next step
              for your visit.
            </p>

            <ul className="booking-page__list">
              {BOOKING_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="booking-page__actions">
              <BookingButton className="btn btn-teal">
                Book Appointment
              </BookingButton>
              <a href="mailto:hello@primefixlondon.co.uk" className="btn btn-white">
                Email Our Team
              </a>
            </div>
          </div>

          <div className="booking-page__panel">
            <BookingForm
              title="Request your preferred slot"
              description="Complete the form below if you want to send the appointment request directly from the booking page."
              submitLabel="Send Booking Request"
              idPrefix="booking-page"
            />
          </div>
        </div>
      </section>

      <HowItWorks />
    </main>
  );
}
