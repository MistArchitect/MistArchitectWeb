import { isSanityConfigured } from "@/sanity/env";

import { Studio } from "./studio";

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <main className="studio-setup">
        <p className="kicker">CMS Setup</p>
        <h1>Connect Sanity to open MIST ARCHITECT Studio.</h1>
        <p>
          Create a Sanity project, copy `.env.example` to `.env.local`, then fill in
          the project ID and dataset. Restart the dev server after changing env vars.
        </p>
        <pre>{`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-13`}</pre>
      </main>
    );
  }

  return <Studio />;
}
