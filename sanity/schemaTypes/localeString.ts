import { defineField, defineType } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "zh",
      title: "中文",
      type: "string"
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string"
    })
  ]
});
