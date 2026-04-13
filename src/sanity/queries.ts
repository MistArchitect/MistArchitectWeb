import { groq } from "next-sanity";

const projectFields = groq`
  _id,
  "slug": slug.current,
  code,
  year,
  location,
  status,
  typology,
  title,
  dek,
  body,
  "image": coverImage.asset->url,
  "heroImage": coalesce(heroImage.asset->url, coverImage.asset->url),
  "imageAlt": coverImage.alt,
  "heroAlt": heroImage.alt,
  "credit": coalesce(heroImage.credit, coverImage.credit, ""),
  "gallery": gallery[]{
    "src": asset->url,
    alt,
    credit
  },
  videoUrl
`;

export const projectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
    ${projectFields}
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectFields}
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const journalEntriesQuery = groq`
  *[_type == "journalEntry" && defined(slug.current)] | order(coalesce(date, publishedAt, _createdAt) desc) {
    _id,
    "slug": slug.current,
    "date": coalesce(date, string::split(_createdAt, "T")[0]),
    category,
    title,
    dek,
    "image": coverImage.asset->url,
    "imageAlt": coverImage.alt
  }
`;
