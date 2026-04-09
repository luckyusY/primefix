import BookingButton from "@/components/BookingButton";
import HouseProjectCarousel from "@/components/HouseProjectCarousel";
import { RECENT_HOUSES } from "@/lib/recentProjects";

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-head section-head--left">
          <span className="label">Recent Projects</span>
          <h2>Recent Repairs &amp; Maintenance</h2>
          <div className="divider"></div>
          <p>
            Four recent projects across London—each gallery shows multiple photos
            from the same property. Swipe or use the arrows to browse.
          </p>
        </div>

        <div className="house-projects">
          {RECENT_HOUSES.map((house) => (
            <HouseProjectCarousel
              key={house.id}
              title={house.title}
              description={house.description}
              images={house.images}
            />
          ))}
        </div>

        <div className="projects-cta">
          <BookingButton className="btn btn-teal">Book a similar visit</BookingButton>
        </div>
      </div>
    </section>
  );
}
