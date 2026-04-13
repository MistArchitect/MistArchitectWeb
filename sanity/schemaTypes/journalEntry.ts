import { defineField, defineType } from "sanity";

export const journalEntry = defineType({
  name: "journalEntry",
  title: "Journal Entry",
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
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date"
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "localeString"
    }),
    defineField({
      name: "dek",
      title: "Short Description",
      type: "localeText"
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "localeString"
        })
      ]
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime"
    })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "date",
      media: "coverImage"
    }
  }
});
