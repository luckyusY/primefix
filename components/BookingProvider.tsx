"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import BookingForm from "@/components/BookingForm";

type BookingContextValue = {
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const value = useMemo(
    () => ({
      openBooking: () => setOpen(true),
      closeBooking: () => setOpen(false),
    }),
    []
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {open ? (
        <div className="booking-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="booking-modal__backdrop"
            aria-label="Close booking popup"
            onClick={() => setOpen(false)}
          />

          <div className="booking-modal__dialog">
            <button
              type="button"
              className="booking-modal__close"
              aria-label="Close booking popup"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="booking-modal__copy">
              <span className="label">Book Appointment</span>
              <h2>Choose the right visit for your home</h2>
              <p>
                Use this popup to request a time that suits you. We will review
                the service details and confirm the appointment as quickly as
                possible.
              </p>
            </div>

            <BookingForm
              className="booking-form--modal"
              onSuccess={() => window.setTimeout(() => setOpen(false), 1200)}
            />
          </div>
        </div>
      ) : null}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}
