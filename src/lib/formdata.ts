/**
 * Build a FormData object from a form state + optional image file.
 * Array fields are JSON-stringified so the backend can parse them.
 */
export function buildFormData(
  formState: Record<string, any>,
  imageFile: File | null,
  imageFieldName = "image"
): FormData {
  const fd = new FormData();

  for (const [key, value] of Object.entries(formState)) {
    if (key === "image_url" && imageFile) continue; // skip URL if file provided
    if (Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
    } else if (value !== null && value !== undefined) {
      fd.append(key, String(value));
    }
  }

  if (imageFile) {
    fd.append(imageFieldName, imageFile);
  }

  return fd;
}
