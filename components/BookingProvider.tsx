"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import BookingForm from "@/components/BookingForm";
import BrandLogo from "@/components/BrandLogo";

type BookingContextValue = {
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const formWrapRef = useRef<HTMLDivElement>(null);

  /* Scroll form back to top on each open */
  useEffect(() => {
    if (open && formWrapRef.current) {
      formWrapRef.current.scrollTo(0, 0);
    }
  }, [open]);

  const value = useMemo(
    () => ({
      openBooking:  () => setOpen(true),
      closeBooking: () => setOpen(false),
    }),
    []
  );

  return (
    <BookingContext.Provider value={value}>
      {children}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/* Backdrop */}
          <Dialog.Overlay className="booking-modal__backdrop" />

          {/* Dialog box */}
          <Dialog.Content
            className="booking-modal__dialog"
            aria-labelledby="booking-modal-title"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Close button */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="booking-modal__close"
                aria-label="Close booking popup"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>

            {/* ── Left info panel ── */}
            <div className="booking-modal__copy">
              <BrandLogo className="booking-modal__logo" />

              <div className="booking-modal__copy-text">
                <span className="label">Book Appointment</span>
                <Dialog.Title id="booking-modal-title" asChild>
                  <h2>Choose the right visit for your home</h2>
                </Dialog.Title>
                <p>
                  Tell us what needs attention and pick a time that suits you.
                  PrimeFix Hub will confirm the visit and keep you updated
                  every step of the way.
                </p>
              </div>

              <div className="booking-modal__trust">
                {[
                  "Fixed-rate pricing — no surprises",
                  "Fully insured up to £5 million",
                  "Aftercare support included",
                  "Gas Safe & TrustMark registered",
                ].map((item) => (
                  <div className="booking-modal__trust-item" key={item}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>

              <div className="booking-modal__contact">
                <p>Prefer to speak with us?</p>
                <a href="tel:+447507113805">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
                  </svg>
                  +44 7507 113805
                </a>
                <a
                  href="https://wa.me/447507113805"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22c-1.85 0-3.66-.5-5.24-1.44l-.38-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10Zm5.47-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07a8.16 8.16 0 0 1-2.4-1.48 9.03 9.03 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* ── Right scrollable form ── */}
            <div className="booking-modal__form-wrap" ref={formWrapRef}>
              <BookingForm
                className="booking-form--modal"
                idPrefix="booking-modal"
                onSuccess={() => window.setTimeout(() => setOpen(false), 1400)}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used inside BookingProvider");
  return context;
}
