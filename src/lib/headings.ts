export type ArticleHeading = { label: string; id: string };

export function stripMarkup(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").trim();
}

export function createHeadingId(value: string, used = new Map<string, number>()) {
  const base = stripMarkup(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
}

export function extractArticleHeadings(html: string): ArticleHeading[] {
  const used = new Map<string, number>();
  return [...html.matchAll(/<h[2-3]\b[^>]*>([\s\S]*?)<\/h[2-3]>/gi)].map((match) => {
    const label = stripMarkup(match[1]);
    return { label, id: createHeadingId(label, used) };
  });
}
