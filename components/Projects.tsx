import Animate, { StaggerContainer, StaggerItem } from "@/components/Animate";
import BookingButton from "@/components/BookingButton";
import HouseProjectCarousel from "@/components/HouseProjectCarousel";
import type { Project } from "@/lib/types";

export default function Projects({ items }: { items: Project[] }) {
  const totalPhotos = items.reduce((sum, house) => sum + house.images.length, 0);
  const stats = [
    { value: String(items.length).padStart(2, "0"), label: "Recent home galleries" },
    { value: String(totalPhotos).padStart(2, "0"), label: "Real site photos" },
    { value: "A-Z", label: "From strip-out to polished finish" },
    { value: "360", label: "Multiple angles on every job" },
  ];

  return (
    <section className="projects" id="projects">
      <div className="container projects__shell">
        <Animate className="projects__hero" variant="fadeUp">
          <div className="projects__hero-copy">
            <span className="label">Project Journal</span>
            <h2>From strip-out to polished finish, the work tells the story.</h2>
            <div className="divider"></div>
            <p>
              These are not stock before-and-after placeholders. Each gallery shows
              real PrimeFix Hub site work across repair, finishing, and room-by-room
              improvement, so clients can see the detail, the cleanliness, and the
              standard we aim to hand over.
            </p>
          </div>

          <div className="projects__stats" aria-label="Projects overview">
            {stats.map((stat) => (
              <div key={stat.label} className="projects__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </Animate>

        <Animate className="projects__signals" variant="fadeUp" delay={0.08}>
          <span>Real site photography</span>
          <span>Swipe each gallery</span>
          <span>Repair and finishing work</span>
          <span>Recent London homes</span>
        </Animate>

        <StaggerContainer className="house-projects" stagger={0.1} delay={0.06}>
          {items.map((house, index) => (
            <StaggerItem key={house.id}>
              <HouseProjectCarousel
                number={index + 1}
                kicker={house.kicker}
                title={house.title}
                description={house.description}
                scope={house.scope}
                outcome={house.outcome}
                tags={house.tags}
                images={house.images}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Animate className="projects__footer" variant="fadeUp" delay={0.1}>
          <div className="projects__footer-copy">
            <span className="projects__footer-label">Have something similar in mind?</span>
            <p>
              Whether the job starts with repair work, finishing, or a full room reset,
              we can scope it clearly and help you move toward a clean handover.
            </p>
          </div>

          <div className="projects-cta">
            <BookingButton className="btn btn-teal">Book a similar visit</BookingButton>
          </div>
        </Animate>
      </div>
    </section>
  );
}
