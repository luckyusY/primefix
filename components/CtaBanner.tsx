import Animate from "@/components/Animate";
import BookingButton from "@/components/BookingButton";

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <Animate variant="fadeLeft">
          <div>
            <span className="label label--light">Ready To Start?</span>
            <h2>Book Property Maintenance With Confidence</h2>
            <p>
              From everyday repairs to specialist call-outs, PrimeFix London is
              ready to help across London.
            </p>
          </div>
        </Animate>

        <Animate variant="fadeRight" delay={0.15}>
          <div className="cta-banner__actions">
            <BookingButton className="btn btn-white">
              Book Appointment
            </BookingButton>
            <a href="tel:+447507113805" className="btn btn-outline">Call Now</a>
          </div>
        </Animate>
      </div>
    </section>
  );
}
