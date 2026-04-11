import Animate, { StaggerContainer, StaggerItem } from "@/components/Animate";
import BookingButton from "@/components/BookingButton";
import HouseProjectCarousel from "@/components/HouseProjectCarousel";
import type { Project } from "@/lib/types";

export default function Projects({ items }: { items: Project[] }) {
  return (
    <section className="projects" id="projects">
      <div className="container projects__shell">
        <Animate className="projects__head" variant="fadeUp">
          <span className="label">Project Journal</span>
          <h2>Real work. Real results.</h2>
          <p>
            Each gallery shows actual PrimeFix London site work — repair,
            finishing, and room-by-room improvement across London homes.
          </p>
        </Animate>

        <StaggerContainer className="pj-grid" stagger={0.08} delay={0.04}>
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

        <Animate className="projects__footer" variant="fadeUp" delay={0.08}>
          <p>Have something similar in mind?</p>
          <BookingButton className="btn btn-teal">Book a visit</BookingButton>
        </Animate>
      </div>
    </section>
  );
}
