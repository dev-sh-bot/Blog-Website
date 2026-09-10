import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile navigation opens without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  const menu = page.getByRole("button", { name: "Toggle navigation" });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Search articles", { exact: true })).toBeVisible();
});

test("article content stays within the mobile viewport", async ({ page }) => {
  await page.goto("/blog/the-art-of-finding-joy-in-the-everyday");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await expect(page.getByRole("heading", { name: "Start with what is already here" })).toBeVisible();
});
