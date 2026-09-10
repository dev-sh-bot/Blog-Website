import assert from "node:assert/strict";
import test from "node:test";
import { calculateReadingTime, slugify } from "../src/lib/utils";
import { extractArticleHeadings } from "../src/lib/headings";
import { sanitizeArticleHtml } from "../src/lib/sanitize-core";
import { safeJsonLd } from "../src/lib/seo";
import { taxonomySchema } from "../src/lib/taxonomy-schema";
import { resolvePublicationDate } from "../src/lib/publishing";
import { demoAuthors, demoCategories, demoPosts, demoTags } from "../src/lib/seed-data";

test("slugify creates stable URL-safe slugs", () => {
  assert.equal(slugify("How AI Changes Software — 2026"), "how-ai-changes-software-2026");
});

test("reading time is calculated from content", () => {
  assert.equal(calculateReadingTime("<p>one two three</p>"), 1);
  assert.equal(calculateReadingTime(Array.from({ length: 401 }, () => "word").join(" ")), 3);
});

test("seed content satisfies the editorial minimum", () => {
  assert.equal(demoAuthors.length, 4);
  assert.equal(demoCategories.length, 12);
  assert.ok(demoTags.length >= 10);
  assert.ok(demoPosts.length >= 12);
  assert.ok(demoPosts.every((post) => post.title && post.excerpt && post.content && post.featuredImage.alt));
  assert.deepEqual(new Set(demoPosts.map((post) => post.template)), new Set(["classic", "magazine", "minimal"]));
  assert.ok(demoPosts.every((post) => post.seo.title && post.seo.description && post.seo.ogImage && post.readingTime > 0));
});

test("demo publication covers broad interests with complete relationships", () => {
  const categories = new Set(demoCategories.map((category) => category.id));
  const tags = new Set(demoTags.map((tag) => tag.id));
  const authors = new Set(demoAuthors.map((author) => author.id));
  assert.equal(new Set(demoPosts.map((post) => post.slug)).size, demoPosts.length);
  for (const category of categories) assert.ok(demoPosts.some((post) => post.categoryId === category), `Missing sample story for ${category}`);
  for (const post of demoPosts) {
    assert.ok(categories.has(post.categoryId));
    assert.ok(authors.has(post.authorId));
    assert.ok(post.tagIds.every((id) => tags.has(id)), `Unresolved tags in ${post.slug}`);
    assert.equal(post.readingTime, calculateReadingTime(post.content));
  }
  assert.ok(demoPosts.filter((post) => post.categoryId === "technology").length < demoPosts.length / 4);
  assert.ok(demoPosts.filter((post) => post.categoryId === "health-wellness").every((post) => /not medical advice|not a treatment/.test(post.content)));
});

test("article headings receive stable unique IDs and unsafe markup is removed", () => {
  const html = "<h2 id='replace-me'>Same section</h2><h2>Same section</h2><script>alert('xss')</script>";
  const headings = extractArticleHeadings(html);
  assert.deepEqual(headings.map((heading) => heading.id), ["same-section", "same-section-2"]);
  const safe = sanitizeArticleHtml(html);
  assert.match(safe, /id="same-section"/);
  assert.match(safe, /id="same-section-2"/);
  assert.doesNotMatch(safe, /script/i);
  assert.doesNotMatch(safe, /replace-me/);
  assert.doesNotMatch(sanitizeArticleHtml('<a href="javascript:alert(1)" onclick="alert(2)">unsafe</a>'), /javascript:|onclick/i);
});

test("JSON-LD serialization cannot close its script element", () => {
  const serialized = safeJsonLd({ headline: "</script><script>alert(1)</script>" });
  assert.doesNotMatch(serialized, /<\/?script/i);
  assert.deepEqual(JSON.parse(serialized), { headline: "</script><script>alert(1)</script>" });
});

test("taxonomy records allow server-generated slugs", () => {
  const parsed = taxonomySchema.parse({ name: "New Category", slug: "" });
  assert.equal(parsed.slug, "");
  assert.equal(slugify(parsed.slug || parsed.name), "new-category");
});

test("explicit publishing never leaves an article hidden in the future", () => {
  const now = new Date("2026-09-10T12:00:00.000Z");
  const future = new Date("2026-09-11T12:00:00.000Z");
  const past = new Date("2026-09-09T12:00:00.000Z");
  assert.equal(resolvePublicationDate("published", future, now).toISOString(), now.toISOString());
  assert.equal(resolvePublicationDate("published", past, now).toISOString(), past.toISOString());
  assert.equal(resolvePublicationDate("scheduled", future, now).toISOString(), future.toISOString());
});
