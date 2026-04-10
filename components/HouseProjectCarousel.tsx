"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";

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
  description,
  scope,
  outcome,
  tags,
  images,
}: HouseProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const galleryImages =
    images.length > 0
      ? images
      : [{ src: "/media/home-exterior.jpg", alt: `${title} project photo` }];
  const n = galleryImages.length;

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
      <div className="house-project__panel">
        <div className="house-project__intro">
          <div className="house-project__kicker-row">
            <span className="house-project__number">{String(number).padStart(2, "0")}</span>
            <span className="house-project__kicker">{kicker}</span>
          </div>

          <h3>{title}</h3>
          <p>{description}</p>

          <div className="house-project__meta">
            <div className="house-project__meta-card">
              <span>Scope</span>
              <strong>{scope}</strong>
            </div>
            <div className="house-project__meta-card">
              <span>Outcome</span>
              <strong>{outcome}</strong>
            </div>
          </div>

          <ul className="house-project__tags" aria-label="Project highlights">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        <div className="house-project__gallery">
          <div className="house-project__frame">
            <div className="house-project__overlay">
              <span>Swipe gallery</span>
              <span>
                {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </span>
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
                {galleryImages.map((img, i) => {
                  const distance = Math.abs(i - index);
                  const circularDistance = Math.min(distance, n - distance);
                  const shouldPreload = circularDistance <= 1;
                  const displaySrc = getProjectCarouselImageSrc(img.src);
                  const unoptimized = shouldBypassNextImageOptimization(displaySrc);

                  return (
                    <div
                      key={`${img.src}-${i}`}
                      className="house-project__slide"
                      style={{ width: `${100 / n}%` }}
                    >
                      <div className="house-project__slide-inner">
                        <Image
                          src={displaySrc}
                          alt={img.alt}
                          fill
                          unoptimized={unoptimized}
                          loading={shouldPreload ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 94vw, (max-width: 1200px) 60vw, 720px"
                          className="house-project__img"
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

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

            <div className="house-project__progress">
              <div className="house-project__dots" role="tablist" aria-label="Slide selection">
                {galleryImages.map((_, i) => (
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
              <span className="house-project__count">{n} photos</span>
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
        </div>
      </div>
    </article>
  );
}
