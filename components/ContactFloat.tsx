"use client";

import { useState } from "react";

export default function ContactFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`cfloat ${open ? "cfloat--open" : ""}`}>
      {/* Options */}
      <a
        href="https://wa.me/447507113805"
        target="_blank"
        rel="noopener noreferrer"
        className="cfloat__option cfloat__option--wa"
        aria-label="WhatsApp us"
        tabIndex={open ? 0 : -1}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22c-1.85 0-3.66-.5-5.24-1.44l-.38-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10Zm5.47-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07a8.16 8.16 0 0 1-2.4-1.48 9.03 9.03 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
        </svg>
        <span>WhatsApp</span>
      </a>

      <a
        href="tel:+447507113805"
        className="cfloat__option cfloat__option--call"
        aria-label="Call us"
        tabIndex={open ? 0 : -1}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/>
        </svg>
        <span>Call Us</span>
      </a>

      {/* Trigger */}
      <button
        className="cfloat__trigger"
        aria-label={open ? "Close contact options" : "Contact support"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="cfloat__icon cfloat__icon--support"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12v4c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2H4.07C4.56 7.19 7.92 4 12 4s7.44 3.19 7.93 7H19c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1v1c0 1.1-.9 2-2 2h-2.17A3.001 3.001 0 0 1 12 23a3 3 0 0 1-2.83-2H9c-1.66 0-3-1.34-3-3v-1c0-.55.45-1 1-1s1 .45 1 1v1c0 .55.45 1 1 1h.17A3.001 3.001 0 0 1 12 17a3 3 0 0 1 2.83 2H17c.55 0 1-.45 1-1v-2h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-1.07C18.44 7.19 15.08 4 11 4"/>
        </svg>
        <svg
          className="cfloat__icon cfloat__icon--close"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="cfloat__backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
