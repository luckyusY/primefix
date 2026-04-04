"use client";

import { ButtonHTMLAttributes, MouseEvent } from "react";
import { useBooking } from "@/components/BookingProvider";

type BookingButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function BookingButton({
  children,
  onClick,
  type,
  ...props
}: BookingButtonProps) {
  const { openBooking } = useBooking();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      openBooking();
    }
  };

  return (
    <button type={type ?? "button"} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
