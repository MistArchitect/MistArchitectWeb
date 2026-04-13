import { film } from "./film";
import { journalEntry } from "./journalEntry";
import { localeString } from "./localeString";
import { localeText } from "./localeText";
import { project } from "./project";
import { projectCategory } from "./projectCategory";
import { siteSettings } from "./siteSettings";
import { teamMember } from "./teamMember";

export const schemaTypes = [
  localeString,
  localeText,
  projectCategory,
  project,
  journalEntry,
  film,
  teamMember,
  siteSettings
];
