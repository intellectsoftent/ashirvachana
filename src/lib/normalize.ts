/**
 * Safely parse a field that may be a comma-separated string or an array.
 */
export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Normalize common array fields on a pooja/idol/blog object
 * so components can safely call .map() without crashing.
 */
export function normalizeItem(item: Record<string, any>): Record<string, any> {
  const arrayFields = ["benefits", "includes", "features", "tags", "location_ids"];
  const copy = { ...item };
  for (const field of arrayFields) {
    // Always normalize — set to [] even if field is missing/null/undefined
    copy[field] = toArray(copy[field]);
  }
  // If backend returns locations via Sequelize include, derive location_ids for UI/forms.
  if (
    Array.isArray(copy.locations) &&
    copy.locations.length > 0 &&
    Array.isArray(copy.location_ids) &&
    copy.location_ids.length === 0
  ) {
    copy.location_ids = copy.locations
      .map((l: any) => l?.id)
      .filter((id: any) => id !== undefined && id !== null)
      .map((id: any) => String(id));
  }
  return copy;
}

export function normalizeList(items: any[]): any[] {
  return items.map(normalizeItem);
}
