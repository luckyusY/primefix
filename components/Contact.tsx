"use client";

import { FormEvent, useState } from "react";
import ScaffoldIllustration from "@/components/ScaffoldIllustration";

const SERVING_POINTS = [
  "Transparent, fixed pricing",
  "Fully insured and guaranteed work",
  "Free, no-obligation quotations",
  "Fast 1-3 hour response times",
  "Friendly, experienced engineers and tradesmen",
];

export default function Contact() {
  const [success, setSuccess] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (event.target as HTMLFormElement).reset();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-lead">
          <div className="contact-lead__copy">
            <span className="label label--light">Contact Our Expert Team</span>
            <h2>Need help with urgent issues or a full refurbishment?</h2>
            <p>
              Tell us what you need and our team will arrange your consultation
              and custom project quote.
            </p>
            <p className="contact-lead__urgent">
              If you&apos;re facing urgent issues, call us right now.
            </p>
            <a href="tel:02031488884" className="btn btn-white">
              Call 020 3148 8884
            </a>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <h3>Send Enquiry</h3>
            <div className="form-field">
              <label>Name</label>
              <input type="text" required />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input type="tel" required />
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea
                required
                placeholder="Tell us about the repair, maintenance issue, or project you need help with."
              />
            </div>
            <button type="submit" className="form-submit">
              Send Enquiry
            </button>
            <div className={`form-success ${success ? "show" : ""}`}>
              Thanks, your enquiry has been received and our team will be in
              touch shortly.
            </div>
          </form>
        </div>

        <div className="serving-block">
          <div className="serving-block__visual">
            <ScaffoldIllustration className="serving-block__graphic" />
          </div>

          <div className="serving-block__content">
            <span className="label">Why Clients Choose Us</span>
            <h2>Proudly Serving London&apos;s Homes And Businesses</h2>
            <p>
              With over 25 years of combined experience, UpKeep UK provides
              trusted property maintenance, construction, and refurbishment
              services for homeowners, landlords, estate agents, and commercial
              clients across the capital.
            </p>
            <ul>
              {SERVING_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <a href="#contact" className="btn btn-teal">
              Request Your Custom Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
