export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSlugFromArray(slug: string, items: any[]): any {
  return items.find((item) => item.slug === slug);
}
