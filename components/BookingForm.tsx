"use client";

import { FormEvent, useState } from "react";

type BookingFormProps = {
  className?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  idPrefix?: string;
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
  description = "Share a few details and PrimeFix Hub will confirm the best appointment slot for your repair or service visit.",
  submitLabel = "Confirm Booking Request",
  idPrefix = "booking",
  onSuccess,
}: BookingFormProps) {
  const [success, setSuccess] = useState(false);
  const fieldIds = {
    name: `${idPrefix}-name`,
    email: `${idPrefix}-email`,
    phone: `${idPrefix}-phone`,
    service: `${idPrefix}-service`,
    date: `${idPrefix}-date`,
    time: `${idPrefix}-time`,
    address: `${idPrefix}-address`,
    details: `${idPrefix}-details`,
  };

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
          <label htmlFor={fieldIds.name}>Full Name</label>
          <input id={fieldIds.name} type="text" required />
        </div>

        <div className="booking-field">
          <label htmlFor={fieldIds.email}>Email</label>
          <input id={fieldIds.email} type="email" required />
        </div>

        <div className="booking-field">
          <label htmlFor={fieldIds.phone}>Phone Number</label>
          <input id={fieldIds.phone} type="tel" required />
        </div>

        <div className="booking-field">
          <label htmlFor={fieldIds.service}>Service Needed</label>
          <select id={fieldIds.service} defaultValue="" required>
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
          <label htmlFor={fieldIds.date}>Preferred Date</label>
          <input id={fieldIds.date} type="date" required />
        </div>

        <div className="booking-field">
          <label htmlFor={fieldIds.time}>Preferred Time</label>
          <input id={fieldIds.time} type="time" required />
        </div>

        <div className="booking-field booking-field--full">
          <label htmlFor={fieldIds.address}>Address / Postcode</label>
          <input id={fieldIds.address} type="text" required />
        </div>

        <div className="booking-field booking-field--full">
          <label htmlFor={fieldIds.details}>Repair Details</label>
          <textarea
            id={fieldIds.details}
            required
            placeholder="Tell us what needs attention and any booking notes we should know before the visit."
          />
        </div>
      </div>

      <button type="submit" className="btn btn-teal booking-form__submit">
        {submitLabel}
      </button>

      <div
        className={`booking-form__success ${success ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        Thanks, your booking request has been received. PrimeFix Hub will
        be in touch shortly to confirm the appointment.
      </div>
    </form>
  );
}
