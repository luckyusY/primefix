"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";

const NAV_ITEMS = [
  { label: "Home Repairs", href: "#services" },
  { label: "Appliance Repairs", href: "#appliance-support" },
  { label: "Process", href: "#process" },
  { label: "Coverage", href: "#contact" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <BrandLogo className="brand-logo--nav" priority />

        <nav className="nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
              onClick={close}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="tel:+447507113805" className="nav-call" onClick={close}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/>
          </svg>
          +44 7507 113805
        </a>

        <a href="#contact" className="btn btn-teal nav-cta" onClick={close}>
          Get Quote <span aria-hidden="true">&rarr;</span>
        </a>

        <button
          className={`hamburger ${open ? "open" : ""}`}
          aria-label="Menu"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${open ? "open" : ""}`}
        aria-label="Mobile"
      >
        {NAV_ITEMS.map((item) => (
          <a key={item.label} href={item.href} onClick={close}>
            {item.label}
          </a>
        ))}
        <a href="tel:+447507113805" className="mobile-nav__call" onClick={close}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/>
          </svg>
          +44 7507 113805
        </a>
        <a
          href="#contact"
          className="btn btn-teal mobile-nav__cta"
          onClick={close}
        >
          Get Quote <span aria-hidden="true">&rarr;</span>
        </a>
      </nav>
    </header>
  );
}
