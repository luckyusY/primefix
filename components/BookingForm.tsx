"use client";

import { FormEvent, useState } from "react";

type BookingFormProps = {
  className?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

const SERVICE_OPTIONS = [
  "Home Repairs",
  "Appliance Repairs",
  "Plumbing",
  "Electrical",
  "Heating",
  "Drainage / Locksmith / Windows",
  "Pest Control",
];

export default function BookingForm({
  className = "",
  title = "Book your appointment",
  description = "Share a few details and PrimeFix London will confirm the best appointment slot for your repair or service visit.",
  submitLabel = "Confirm Booking Request",
  onSuccess,
}: BookingFormProps) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (event.target as HTMLFormElement).reset();
    setSuccess(true);
    onSuccess?.();
    window.setTimeout(() => setSuccess(false), 5000);
  };

  const classes = ["booking-form", className].filter(Boolean).join(" ");

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <div className="booking-form__intro">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="booking-form__grid">
        <div className="booking-field">
          <label htmlFor="booking-name">Full Name</label>
          <input id="booking-name" type="text" required />
        </div>

        <div className="booking-field">
          <label htmlFor="booking-email">Email</label>
          <input id="booking-email" type="email" required />
        </div>

        <div className="booking-field">
          <label htmlFor="booking-phone">Phone Number</label>
          <input id="booking-phone" type="tel" required />
        </div>

        <div className="booking-field">
          <label htmlFor="booking-service">Service Needed</label>
          <select id="booking-service" defaultValue="" required>
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label htmlFor="booking-date">Preferred Date</label>
          <input id="booking-date" type="date" required />
        </div>

        <div className="booking-field">
          <label htmlFor="booking-time">Preferred Time</label>
          <input id="booking-time" type="time" required />
        </div>

        <div className="booking-field booking-field--full">
          <label htmlFor="booking-address">Address / Postcode</label>
          <input id="booking-address" type="text" required />
        </div>

        <div className="booking-field booking-field--full">
          <label htmlFor="booking-details">Repair Details</label>
          <textarea
            id="booking-details"
            required
            placeholder="Tell us what needs attention and any booking notes we should know before the visit."
          />
        </div>
      </div>

      <button type="submit" className="btn btn-teal booking-form__submit">
        {submitLabel}
      </button>

      <div className={`booking-form__success ${success ? "show" : ""}`}>
        Thanks, your booking request has been received. PrimeFix London will
        be in touch shortly to confirm the appointment.
      </div>
    </form>
  );
}
