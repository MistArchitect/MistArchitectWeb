import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      initialValue: "Mist Architect"
    }),
    defineField({
      name: "description",
      title: "Default SEO Description",
      type: "localeText"
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string"
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Home Hero Video URL",
      type: "url"
    }),
    defineField({
      name: "heroPoster",
      title: "Home Hero Poster",
      type: "image",
      options: {
        hotspot: true
      }
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "email"
    }
  }
});
