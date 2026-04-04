import BrandMark from "@/components/BrandMark";

const SERVICES = [
  { label: "Construction", href: "#how" },
  { label: "Property Maintenance", href: "#services" },
];

const QUICK_LINKS = [
  { label: "Careers", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "#projects", highlighted: true },
  { label: "Keep Up Blog", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Sitemap", href: "#" },
];

const CONTACT_ITEMS = [
  { label: "admin@upkeep.co.uk", href: "mailto:admin@upkeep.co.uk" },
  { label: "projects@fmsupkeep.com", href: "mailto:projects@fmsupkeep.com" },
  { label: "marketing@fmsupkeep.com", href: "mailto:marketing@fmsupkeep.com" },
  { label: "admin@fmsupkeep.com", href: "mailto:admin@fmsupkeep.com" },
  { label: "+44 20314 88884", href: "tel:+442031488884" },
  {
    label: "8 Raven Rd, E18 1HB, London",
    href: "https://maps.google.com/?q=8+Raven+Rd,+E18+1HB,+London",
  },
];

const SOCIALS = [
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "TikTok", href: "#", icon: "tiktok" },
  { label: "YouTube", href: "#", icon: "youtube" },
] as const;

function SocialIcon({ icon }: { icon: (typeof SOCIALS)[number]["icon"] }) {
  switch (icon) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.75 8.25A1.5 1.5 0 1 0 6.75 5.25a1.5 1.5 0 0 0 0 3ZM5.5 9.5H8V18H5.5V9.5Zm4 0h2.4v1.16h.03c.33-.63 1.14-1.4 2.53-1.4 2.7 0 3.2 1.77 3.2 4.08V18h-2.5v-4.1c0-.98-.02-2.24-1.36-2.24-1.36 0-1.57 1.07-1.57 2.17V18H9.5V9.5Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.5 4h7A4.5 4.5 0 0 1 20 8.5v7A4.5 4.5 0 0 1 15.5 20h-7A4.5 4.5 0 0 1 4 15.5v-7A4.5 4.5 0 0 1 8.5 4Zm0 1.8A2.7 2.7 0 0 0 5.8 8.5v7a2.7 2.7 0 0 0 2.7 2.7h7a2.7 2.7 0 0 0 2.7-2.7v-7a2.7 2.7 0 0 0-2.7-2.7h-7Zm7.35 1.35a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 8.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25Zm0 1.8A1.95 1.95 0 1 0 13.95 12 1.95 1.95 0 0 0 12 10.05Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.4 20v-7.1h2.38l.36-2.76H13.4V8.37c0-.8.22-1.35 1.37-1.35H16.3V4.55c-.27-.04-1.18-.11-2.24-.11-2.22 0-3.74 1.35-3.74 3.83v1.86H7.8v2.76h2.52V20h3.08Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.2 4c.25 1.6 1.18 2.85 2.8 3.22v2.27a5.5 5.5 0 0 1-2.72-.77v5.13a4.86 4.86 0 1 1-4.87-4.85c.29 0 .58.02.86.08v2.4a2.48 2.48 0 1 0 1.63 2.33V4h2.3Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.4 7.4c-.2-.76-.8-1.36-1.56-1.56C17.46 5.5 12 5.5 12 5.5s-5.46 0-6.84.34C4.4 6.04 3.8 6.64 3.6 7.4 3.25 8.78 3.25 12 3.25 12s0 3.22.35 4.6c.2.76.8 1.36 1.56 1.56 1.38.34 6.84.34 6.84.34s5.46 0 6.84-.34c.76-.2 1.36-.8 1.56-1.56.35-1.38.35-4.6.35-4.6s0-3.22-.35-4.6ZM10.2 15.1V8.9l5.2 3.1-5.2 3.1Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandMark className="brand-mark--footer" />
            <p>UpKeep UK - Property Maintenance &amp; Construction (FMS UpKeep)</p>
            <p>
              UpKeep is a London-based property maintenance company,
              specialising in repairs, refurbishments, and 24/7 emergency
              call-outs.
            </p>
            <p>
              Trusted by homes and businesses across the city for reliable,
              insured, and guaranteed workmanship.
            </p>
            <p className="footer-note">
              Powered by 100% renewable energy and protected by reCAPTCHA.
              Google&apos;s{" "}
              <a href="https://policies.google.com/privacy">Privacy Policy</a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
              apply.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="footer-links">
              {SERVICES.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={item.highlighted ? "is-highlighted" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>

            <div className="socials" aria-label="Social links">
              {SOCIALS.map((item) => (
                <a key={item.label} href={item.href} aria-label={item.label}>
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <p>&copy; 2026 All Rights Reserved.</p>
      </div>
    </footer>
  );
}
