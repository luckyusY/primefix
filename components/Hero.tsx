"use client";

import Image from "next/image";
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
  const serviceCardRef = useRef<HTMLDivElement>(null);
  const processCardRef = useRef<HTMLDivElement>(null);

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

      if (serviceCardRef.current) {
        serviceCardRef.current.style.transform = `translate3d(0, ${-18 + scrollY * 0.08}px, 0)`;
      }

      if (processCardRef.current) {
        processCardRef.current.style.transform = `translate3d(0, ${18 - scrollY * 0.06}px, 0)`;
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
        <Image
          src="/media/hero-london.jpg"
          alt="Open-license view of Tower Bridge in London at sunset"
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-london.jpg"
        >
          <source src="/media/hero-london.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero__overlay"></div>

      <div className="container hero__content">
        <p className="hero__eyebrow">Domestic Appliance Guard</p>
        <h1>Home Repairs, Appliance Support &amp; Fast Property Maintenance In London</h1>
        <p className="hero__subcopy">
          PrimeFix London supports households with plumbing, electrical and
          heating faults, appliance repairs for fridges, ovens and dishwashers,
          plus drainage, locksmith, window and pest control services.
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

        <div className="hero__cards" aria-hidden="true">
          <div className="hero__card hero__card--service" ref={serviceCardRef}>
            <span>Covered Services</span>
            <strong>Repairs in one place</strong>
            <p>
              Home maintenance, appliance faults, drainage, windows,
              locksmiths and more through one trusted team.
            </p>
          </div>

          <div className="hero__card hero__card--process" ref={processCardRef}>
            <span>Simple Process</span>
            <strong>Quote to aftercare</strong>
            <p>
              Request quote, book the visit, get the repair completed, then
              stay supported after the service.
            </p>
          </div>
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
