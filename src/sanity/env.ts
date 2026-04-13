export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-13";

export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replace-me";

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export function isSanityConfigured() {
  return (
    Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) &&
    Boolean(process.env.NEXT_PUBLIC_SANITY_DATASET)
  );
}
