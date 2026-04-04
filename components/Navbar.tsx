"use client";

import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";

const NAV_ITEMS = [
  { label: "Property Maintenance", href: "#services" },
  { label: "Construction", href: "#how" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
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
        <BrandMark className="brand-mark--nav" />

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
