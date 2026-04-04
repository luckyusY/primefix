"use client";

import { useEffect, useRef } from "react";

const PILLARS = [
  "Home Repair & Maintenance",
  "Plumbing",
  "Electrical",
  "Heating",
  "Appliance Repairs",
  "Pest Control",
];

const STATS = [
  { value: "4-step", label: "Request to support journey" },
  { value: "Multi-trade", label: "Home and appliance cover" },
  { value: "Aftercare", label: "Support after service" },
];

export default function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;

      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0) scale(1.08)`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero__media" ref={mediaRef} aria-hidden="true">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero-london.jpg"
        >
          <source src="/media/hero-london-night.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero__overlay"></div>

      <div className="container hero__content">
        <p className="hero__eyebrow">PrimeFix London</p>
        <h1>Domestic Appliance Guard &amp; Home Repairs</h1>
        <p className="hero__subcopy">
          From plumbing, electrical and heating faults to fridges, ovens,
          dishwashers, drainage, locksmith, window repairs and pest control,
          PrimeFix London gives London households one clear route from quote to
          after-service support.
        </p>

        <div className="hero__actions">
          <a href="#contact" className="btn btn-teal hero__button">
            Request A Quote
          </a>
          <a
            href="tel:+447507113805"
            className="btn hero__button hero__button--phone"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/>
            </svg>
            +44 7507 113805
          </a>
        </div>

        <div className="hero__pillars">
          {PILLARS.map((pillar) => (
            <span key={pillar}>{pillar}</span>
          ))}
        </div>

        <div className="hero__stats">
          {STATS.map((stat) => (
            <div className="hero__stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__curve" aria-hidden="true">
        <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
          <path
            d="M0 86c204 18 420 28 647 22 269-8 533-40 793-33v35H0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
