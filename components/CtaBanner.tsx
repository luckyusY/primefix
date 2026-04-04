export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <div>
          <span className="label label--light">Ready To Start?</span>
          <h2>Request Your Free Custom Quote</h2>
          <p>
            Whether you need rapid reactive maintenance or a larger design and
            build project, PrimeFix London is ready to help.
          </p>
        </div>

        <div className="cta-banner__actions">
          <a href="#contact" className="btn btn-white">
            Get Free Quote
          </a>
          <a href="tel:02012345678" className="btn btn-outline">
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
