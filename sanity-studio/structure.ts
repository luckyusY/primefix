import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("PrimeFix CMS")
    .items([
      S.listItem().title("Homepage").id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem().title("Site Settings").id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("servicePoint").title("Service Points (Overview)"),
      S.documentTypeListItem("review").title("Reviews"),
      S.documentTypeListItem("project").title("Projects / Support Types"),
      S.documentTypeListItem("faq").title("FAQ"),
      S.documentTypeListItem("howItWorks").title("How It Works Steps"),
    ]);
