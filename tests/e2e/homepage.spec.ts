import { expect, test } from "@playwright/test";

test("banner precedes the introduction and topic links on desktop and mobile", async ({ page }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto("/");
    await expect(page.locator("main > :first-child")).toHaveAttribute("id", "home-banner");
    await expect(page.locator("#home-banner + .publication-intro + .interest-nav")).toHaveCount(1);
    const banner = await page.locator("#home-banner").boundingBox();
    const introduction = await page.locator(".publication-intro").boundingBox();
    const topics = await page.getByRole("navigation", { name: "Explore interests" }).boundingBox();
    expect(banner).not.toBeNull();
    expect(introduction).not.toBeNull();
    expect(topics).not.toBeNull();
    expect(introduction!.y).toBeGreaterThanOrEqual(banner!.y + banner!.height);
    expect(topics!.y).toBeGreaterThanOrEqual(introduction!.y + introduction!.height);
    expect(banner!.width).toBe(width);
    await expect(page.locator("main > section[data-home-section]")).toHaveCount(7);
    await page.screenshot({ path: testInfo.outputPath(`banner-first-${width}.png`) });
  }
});

test("homepage departments link to real stories and author archives", async ({ page }) => {
  await page.goto("/");
  for (const name of ["On the radar", "Latest articles.", "The editor’s edit", "A little more wellbeing.", "Find your next rabbit hole.", "Less theory. More possibility.", "Voices with a point of view.", "Good reads. Straight to your inbox."]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  const spotlight = page.getByRole("link", { name: "Get the full perspective" });
  const story = await spotlight.getAttribute("href");
  await spotlight.click();
  await expect(page).toHaveURL(new RegExp(`${story}$`));
  await expect(page.locator("main h1")).toBeVisible();
  await page.goto("/");
  const writer = page.getByRole("link", { name: "Read their stories" }).first();
  const author = await writer.getAttribute("href");
  await writer.click();
  await expect(page).toHaveURL(new RegExp(`${author}$`));
  await expect(page.locator("main h1")).toBeVisible();
});

test("mobile menu closes with Escape and topic navigation reaches the topic directory", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  await toggle.click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Topics" }).focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Topics" }).click();
  await expect(page).toHaveURL(/\/topics$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { name: "Choose your curiosity." })).toBeInViewport();
});

test("new homepage sections fit narrow phones and tablets", async ({ page }) => {
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `Overflow at ${width}px`).toBe(false);
    const banner = await page.locator("#home-banner").boundingBox();
    expect(banner?.x, `Banner should start at the left edge at ${width}px`).toBe(0);
    expect(banner?.width, `Banner should span the full viewport at ${width}px`).toBe(width);
    expect(await page.locator("main > section[data-home-section]").count()).toBeGreaterThanOrEqual(6);
  }
});

test("dummy newsletter feedback does not claim a real subscription", async ({ page }) => {
  await page.route("**/api/newsletter", (route) => route.fulfill({ json: { ok: true, demo: true } }));
  await page.goto("/#newsletter");
  await page.getByLabel("Email address").fill("reader@example.com");
  await page.locator(".newsletter-form").getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.getByText("Demo preview — no email was saved. Subscriptions activate after Firebase setup.")).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveValue("");
});
