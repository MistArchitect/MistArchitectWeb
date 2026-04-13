import { defineField, defineType } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "zh",
      title: "中文",
      type: "text",
      rows: 5
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 5
    })
  ]
});
