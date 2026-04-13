import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "localeString"
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "localeText"
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number"
    })
  ],
  preview: {
    select: {
      title: "name.en",
      subtitle: "role.en",
      media: "portrait"
    }
  }
});
