import Image from "next/image";
import {
  getProjectCarouselImageSrc,
  shouldBypassNextImageOptimization,
} from "@/lib/media-images";
import type { ProjectImage } from "@/lib/types";

type ProjectPhotoCardProps = {
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
  images,
}: ProjectPhotoCardProps) {
  const photo = images[0] ?? { src: "/media/home-exterior.jpg", alt: title };
  const displaySrc = getProjectCarouselImageSrc(photo.src);
  const unoptimized = shouldBypassNextImageOptimization(displaySrc);

  return (
    <article className="pj-card">
      <div className="pj-card__stage">
        <Image
          src={displaySrc}
          alt={photo.alt}
          fill
          unoptimized={unoptimized}
          sizes="(max-width: 768px) 96vw, (max-width: 1200px) 50vw, 640px"
          className="pj-card__img"
        />
      </div>

      <div className="pj-card__caption">
        <span className="pj-card__num">{String(number).padStart(2, "0")}</span>
        <div className="pj-card__info">
          <strong>{title}</strong>
          <span>{kicker}</span>
        </div>
      </div>

      <div className="pj-card__desc">
        <p>{description}</p>
      </div>
    </article>
  );
}
