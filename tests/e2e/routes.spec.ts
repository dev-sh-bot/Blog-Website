import { expect, test } from "@playwright/test";

test("public route matrix responds successfully", async ({ request }) => {
  const routes = ["/", "/blog", "/topics", "/subscribe", "/about", "/contact", "/privacy", "/terms", "/cookies", "/category/lifestyle", "/category/health-wellness", "/category/blogging", "/category/travel", "/category/food-drink", "/category/technology", "/tag/wellbeing", "/author/sarah-ahmed", "/search", "/admin/login", "/admin", "/admin/posts", "/admin/media", "/admin/admins", "/admin/settings"];
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), `${route} should respond`).toBe(200);
  }
});

test("cursor load-more navigation and newsletter validation work", async ({ page, request }) => {
  await page.goto("/blog");
  const loadMore = page.getByRole("link", { name: /Load more articles/ });
  await expect(loadMore).toBeVisible();
  const href = await loadMore.getAttribute("href");
  expect(href).toMatch(/cursor=/);
  await page.goto(href!);
  await expect(page.getByRole("heading", { name: "Latest articles" })).toBeVisible();
  await page.goto("/blog?category=missing-category");
  await expect(page.getByRole("heading", { name: "No articles found" })).toBeVisible();

  const invalidNewsletter = await request.post("/api/newsletter", { data: { email: "not-an-email" } });
  expect(invalidNewsletter.status()).toBe(400);
});

test("CMS mutation endpoints reject unauthenticated requests", async ({ request }) => {
  const post = await request.post("/api/posts", { data: {} });
  const settings = await request.patch("/api/settings", { data: {} });
  const media = await request.post("/api/media", { data: {} });
  const newAdministrator = await request.post("/api/admins", { data: { email: "new-admin@example.com", role: "editor" } });
  const administrator = await request.patch("/api/admins/example-uid", { data: { role: "editor", active: true } });
  expect(post.status()).toBe(401);
  expect(settings.status()).toBe(401);
  expect(media.status()).toBe(401);
  expect(newAdministrator.status()).toBe(401);
  expect(administrator.status()).toBe(401);
});
