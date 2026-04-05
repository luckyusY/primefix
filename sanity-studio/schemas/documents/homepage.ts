import { defineType, defineField } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      initialValue: "Domestic Appliance Guard & Home Repairs",
    }),
    defineField({
      name: "heroSubcopy",
      title: "Hero Subcopy",
      type: "string",
      initialValue: "From emergency repairs to expert maintenance — PrimeFix London is trusted by London households.",
    }),
    defineField({
      name: "heroPhone",
      title: "Hero Phone Number (display)",
      type: "string",
      initialValue: "+44 7507 113805",
    }),
    defineField({
      name: "accredIntro",
      title: "Accreditations Intro Text",
      type: "string",
      initialValue: "Trusted support for domestic maintenance, appliance repairs and specialist home services across London.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
