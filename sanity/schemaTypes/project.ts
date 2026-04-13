import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
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
      name: "code",
      title: "Project Code",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string"
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "localeString"
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "localeString"
    }),
    defineField({
      name: "typology",
      title: "Typology",
      type: "localeString"
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "projectCategory" }]
    }),
    defineField({
      name: "dek",
      title: "Short Description",
      type: "localeText"
    }),
    defineField({
      name: "body",
      title: "Narrative",
      description: "Separate paragraphs with blank lines. Rich text rendering can be added later.",
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
        }),
        defineField({
          name: "credit",
          title: "Credit",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "localeString"
        }),
        defineField({
          name: "credit",
          title: "Credit",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "localeString"
            }),
            defineField({
              name: "credit",
              title: "Credit",
              type: "string"
            })
          ]
        })
      ]
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url"
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
      subtitle: "code",
      media: "coverImage"
    }
  }
});
