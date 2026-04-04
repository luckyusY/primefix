import Animate from "@/components/Animate";

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <Animate variant="fadeLeft">
          <div>
            <span className="label label--light">Ready To Start?</span>
            <h2>Book Domestic Repair Support With Confidence</h2>
            <p>
              From home maintenance and appliance repairs to drainage, locksmith,
              window and pest control support, PrimeFix London is ready to help.
            </p>
          </div>
        </Animate>

        <Animate variant="fadeRight" delay={0.15}>
          <div className="cta-banner__actions">
            <a href="#contact" className="btn btn-white">Get Free Quote</a>
            <a href="tel:+447507113805" className="btn btn-outline">Call Now</a>
          </div>
        </Animate>
      </div>
    </section>
  );
}
