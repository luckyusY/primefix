import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "phone",
      title: "Phone Number (display)",
      type: "string",
      initialValue: "+44 7507 113805",
    }),
    defineField({
      name: "phoneTel",
      title: "Phone (tel: href, digits only)",
      type: "string",
      initialValue: "+447507113805",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number (digits only)",
      type: "string",
      initialValue: "447507113805",
    }),
    defineField({
      name: "emailHello",
      title: "Email — Hello",
      type: "string",
      initialValue: "hello@primefixlondon.co.uk",
    }),
    defineField({
      name: "emailQuotes",
      title: "Email — Quotes",
      type: "string",
      initialValue: "quotes@primefixlondon.co.uk",
    }),
    defineField({
      name: "emailProjects",
      title: "Email — Projects",
      type: "string",
      initialValue: "projects@primefixlondon.co.uk",
    }),
    defineField({
      name: "emailSupport",
      title: "Email — Support",
      type: "string",
      initialValue: "support@primefixlondon.co.uk",
    }),
    defineField({
      name: "coverage",
      title: "Coverage Area (footer label)",
      type: "string",
      initialValue: "London & Greater London coverage",
    }),
    defineField({
      name: "footerBrand",
      title: "Footer Brand Description",
      type: "text",
      rows: 3,
      initialValue: "PrimeFix London helps households with home repair and maintenance, appliance support, and specialist domestic call-outs across London.",
    }),
    defineField({
      name: "copyright",
      title: "Copyright Line",
      type: "string",
      initialValue: "© 2026 All Rights Reserved.",
    }),
    defineField({
      name: "socialLinkedIn",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "socialInstagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "socialFacebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "socialTikTok",
      title: "TikTok URL",
      type: "url",
    }),
    defineField({
      name: "socialYouTube",
      title: "YouTube URL",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
