// ── Homepage ──────────────────────────────────────────────
export const homepageQuery = `*[_type == "homepage" && _id == "homepage"][0]{
  heroHeading,
  heroSubcopy,
  heroPhone,
  accredIntro
}`;

// ── Site Settings ─────────────────────────────────────────
export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  phone,
  phoneTel,
  whatsapp,
  emailHello,
  emailQuotes,
  emailProjects,
  emailSupport,
  coverage,
  footerBrand,
  copyright,
  socialLinkedIn,
  socialInstagram,
  socialFacebook,
  socialTikTok,
  socialYouTube
}`;

// ── Services ──────────────────────────────────────────────
export const servicesQuery = `*[_type == "service"] | order(order asc){
  _id,
  title,
  body,
  bullets,
  cta,
  reversed,
  "image": image.asset->url,
  "alt": image.alt
}`;

// ── Service Points (overview grid) ───────────────────────
export const servicePointsQuery = `*[_type == "servicePoint"] | order(order asc){
  _id,
  title,
  description
}`;

// ── Reviews ───────────────────────────────────────────────
export const reviewsQuery = `*[_type == "review"] | order(order asc){
  _id,
  name,
  type,
  text
}`;

// ── Projects ──────────────────────────────────────────────
export const projectsQuery = `*[_type == "project"] | order(order asc){
  _id,
  title,
  date,
  description,
  "image": image.asset->url,
  "alt": image.alt
}`;

// ── FAQ ───────────────────────────────────────────────────
export const faqQuery = `*[_type == "faq"] | order(order asc){
  _id,
  question,
  answer
}`;

// ── How It Works ──────────────────────────────────────────
export const howItWorksQuery = `*[_type == "howItWorks"] | order(order asc){
  _id,
  stepNumber,
  title,
  description
}`;
