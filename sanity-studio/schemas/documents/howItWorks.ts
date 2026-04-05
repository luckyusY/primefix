import { defineType, defineField } from "sanity";

export default defineType({
  name: "howItWorks",
  title: "How It Works Steps",
  type: "document",
  fields: [
    defineField({
      name: "stepNumber",
      title: "Step Number (e.g. 01)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "stepNumber" },
  },
});
