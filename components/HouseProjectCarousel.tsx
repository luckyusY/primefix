"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

import {
  getProjectCarouselImageSrc,
  shouldBypassNextImageOptimization,
} from "@/lib/media-images";
import type { ProjectImage } from "@/lib/types";

type HouseProjectCarouselProps = {
  number: number;
  kicker: string;
  title: string;
  description: string;
  scope: string;
  outcome: string;
  tags: string[];
  images: ProjectImage[];
};

export default function HouseProjectCarousel({
  number,
  kicker,
  title,
  images,
}: HouseProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const galleryImages =
    images.length > 0
      ? images
      : [{ src: "/media/home-exterior.jpg", alt: `${title} project photo` }];
  const n = galleryImages.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <article className="pj-card">
      {/* Image stage — fills the card */}
      <div
        className="pj-card__stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {galleryImages.map((img, i) => {
          const displaySrc = getProjectCarouselImageSrc(img.src);
          const unoptimized = shouldBypassNextImageOptimization(displaySrc);
          return (
            <div
              key={`${img.src}-${i}`}
              className={`pj-card__slide${i === index ? " is-active" : ""}`}
              aria-hidden={i !== index}
            >
              <Image
                src={displaySrc}
                alt={img.alt}
                fill
                unoptimized={unoptimized}
                sizes="(max-width: 768px) 96vw, (max-width: 1200px) 50vw, 640px"
                className="pj-card__img"
              />
            </div>
          );
        })}

        {/* Prev / Next arrows */}
        {n > 1 && (
          <>
            <button
              type="button"
              className="pj-card__arrow pj-card__arrow--prev"
              onClick={prev}
              aria-label="Previous photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="pj-card__arrow pj-card__arrow--next"
              onClick={next}
              aria-label="Next photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {n > 1 && (
          <div className="pj-card__dots" role="tablist" aria-label="Photos">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1} of ${n}`}
                className={`pj-card__dot${i === index ? " is-active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption strip */}
      <div className="pj-card__caption">
        <span className="pj-card__num">{String(number).padStart(2, "0")}</span>
        <div className="pj-card__info">
          <strong>{title}</strong>
          <span>{kicker}</span>
        </div>
        <span className="pj-card__count">{n} photos</span>
      </div>
    </article>
  );
}
