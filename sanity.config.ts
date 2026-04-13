import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "./src/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "mist-architect",
  title: "Mist Architect Studio",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});
