"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";

import type { HouseProjectImage } from "@/lib/recentProjects";

type HouseProjectCarouselProps = {
  title: string;
  description: string;
  images: HouseProjectImage[];
};

export default function HouseProjectCarousel({
  title,
  description,
  images,
}: HouseProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const n = Math.max(1, images.length);

  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  const onPanEnd = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      if (reduceMotion) return;
      const threshold = 48;
      if (info.offset.x < -threshold || info.velocity.x < -180) next();
      else if (info.offset.x > threshold || info.velocity.x > 180) prev();
    },
    [next, prev, reduceMotion],
  );

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 280, damping: 32 };

  return (
    <article className="house-project">
      <div className="house-project__intro">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <motion.div
        className="house-project__viewport"
        aria-roledescription="carousel"
        onPanEnd={onPanEnd}
      >
        <motion.div
          className="house-project__track"
          animate={{ x: `-${index * 100}%` }}
          transition={transition}
          style={{ width: `${n * 100}%` }}
        >
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="house-project__slide"
              style={{ width: `${100 / n}%` }}
            >
              <div className="house-project__slide-inner">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 920px"
                  className="house-project__img"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="house-project__controls">
        <button
          type="button"
          className="house-project__btn"
          onClick={prev}
          aria-label="Previous photo"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="house-project__dots" role="tablist" aria-label="Slide selection">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1} of ${n}`}
              className={`house-project__dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="house-project__btn"
          onClick={next}
          aria-label="Next photo"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
