import { defineField, defineType } from "sanity";

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Project Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en"
      },
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "title.zh"
    }
  }
});
