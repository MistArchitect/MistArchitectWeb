import { defineField, defineType } from "sanity";

export const film = defineType({
  name: "film",
  title: "Film",
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
      }
    }),
    defineField({
      name: "dek",
      title: "Short Description",
      type: "localeText"
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "posterImage",
      title: "Poster Image",
      type: "image",
      options: {
        hotspot: true
      }
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
      subtitle: "videoUrl",
      media: "posterImage"
    }
  }
});
