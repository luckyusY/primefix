"use client";

import { FormEvent, useState } from "react";
import ScaffoldIllustration from "@/components/ScaffoldIllustration";
import BookingButton from "@/components/BookingButton";

const SERVING_POINTS = [
  "Home repair and maintenance support",
  "Plumbing, electrical and heating repairs",
  "Appliance repairs for fridges, ovens and dishwashers",
  "Drainage, locksmith and window repair services",
  "Pest control and after-service support",
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
            <h2>Need help with a home repair, appliance fault or urgent visit?</h2>
            <p>
              Tell us what needs fixing and we will help you move from quote to
              booked visit as quickly and clearly as possible.
            </p>
            <p className="contact-lead__urgent">
              If you&apos;re facing urgent issues, call us right now.
            </p>
            <a href="tel:02012345678" className="btn btn-white">
              Call 020 1234 5678
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
                placeholder="Tell us about the repair, appliance issue, or service visit you need help with."
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
            <h2>Domestic Appliance Guard For London Homes</h2>
            <p>
              PrimeFix Hub provides a clearer route for households that need
              reliable home repairs, appliance support, and specialist domestic
              services without the stress of coordinating multiple providers.
            </p>
            <ul>
              {SERVING_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <BookingButton className="btn btn-teal">
              Book Appointment
            </BookingButton>
          </div>
        </div>
      </div>
    </section>
  );
}
