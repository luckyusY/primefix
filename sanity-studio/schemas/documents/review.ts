import { defineType, defineField } from "sanity";

export default defineType({
  name: "review",
  title: "Reviews",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Reviewer Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      title: "Reviewer Type",
      type: "string",
      options: {
        list: ["Homeowner", "Landlord", "Tenant", "Business"],
      },
      initialValue: "Homeowner",
    }),
    defineField({
      name: "text",
      title: "Review Text",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
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
    select: { title: "name", subtitle: "text" },
  },
});
