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
          preload="metadata"
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
            href="tel:02012345678"
            className="btn hero__button hero__button--phone"
          >
            020 1234 5678
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
