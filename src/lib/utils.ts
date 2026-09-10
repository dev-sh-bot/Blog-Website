export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function calculateReadingTime(html: string) {
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return Math.max(1, Math.ceil(plainText.split(" ").filter(Boolean).length / 200));
}

export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${path}`;
}
