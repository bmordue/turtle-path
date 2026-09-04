import type { Level } from "../types";

// Eagerly import every JSON file in ./levels — dropping a new file here
// is enough to add a level, no other code changes needed.
const modules = import.meta.glob("../levels/*.json", { eager: true }) as Record<
  string,
  { default: Level }
>;

export const LEVELS: Level[] = Object.keys(modules)
  .sort()
  .map((key) => modules[key].default);
