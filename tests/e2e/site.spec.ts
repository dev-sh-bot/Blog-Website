import { expect, test } from "@playwright/test";

test("homepage exposes publication navigation and newsletter", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Insightly/);
  await expect(page.getByRole("heading", { name: "Stories for every side of life." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest articles." })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
});

test("topics, subscribe, and about pages have dedicated layouts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Search articles" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Subscribe" }).first()).toHaveAttribute("href", "/subscribe");

  await page.goto("/topics");
  await expect(page.getByRole("heading", { name: "Choose your curiosity." })).toBeVisible();
  await expect(page.locator(".topic-card")).toHaveCount(12);

  await page.goto("/subscribe");
  await expect(page.getByRole("heading", { name: "Good reads. Worth making room for." })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Many interests. One curious place." })).toBeVisible();
  await expect(page.locator(".about-hero")).toBeVisible();
});

test("client navigation starts new pages at the top and centers the topic note", async ({ page }) => {
  await page.goto("/topics");
  const directory = await page.locator(".topics-directory").boundingBox();
  const callout = await page.locator(".topics-directory > .editorial-callout").boundingBox();
  expect(directory).not.toBeNull();
  expect(callout).not.toBeNull();
  expect(Math.abs((callout!.x + callout!.width / 2) - (directory!.x + directory!.width / 2))).toBeLessThan(1);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("link", { name: "See latest stories" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("article includes server-rendered content and sharing controls", async ({ page }) => {
  await page.goto("/blog/the-art-of-finding-joy-in-the-everyday");
  await expect(page.getByRole("heading", { name: /The Art of Finding Joy/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Share on X" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start with what is already here" })).toBeVisible();
});

test("missing article returns a 404 page", async ({ page }) => {
  const response = await page.goto("/blog/missing-article");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("That page took a different route.")).toBeVisible();
});

test("admin editor exposes publishing, SEO and Summernote controls", async ({ page }) => {
  await page.goto("/admin/posts/new");
  await expect(page.getByRole("heading", { name: "New article" })).toBeVisible();
  await expect(page.getByLabel("Publish date")).toBeVisible();
  await expect(page.getByLabel("SEO title")).toBeVisible();
  await expect(page.locator(".note-editor")).toBeVisible();
});

test("taxonomy manager exposes add and delete-safe editing controls", async ({ page }) => {
  await page.goto("/admin/categories");
  await expect(page.getByRole("heading", { name: "New category" })).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit" }).first()).toBeVisible();
});

test("SEO feeds and private admin metadata are exposed correctly", async ({ page, request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/blog/");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("/admin");
  const rss = await request.get("/rss.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  await page.goto("/admin");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto("/admin/posts/new");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
