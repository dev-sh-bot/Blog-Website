import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

// Uses the project's existing browser runtime; never installs a browser.
const baseURL = process.env.PREVIEW_URL || "http://localhost:3000";
const output = "test-results/design-preview";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.setDefaultNavigationTimeout(60000);
try {
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.locator(".cover-story").waitFor();
  for (const section of await page.locator("main section").all()) {
    await section.scrollIntoViewIfNeeded();
  }
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.screenshot({ path: `${output}/home-desktop.png`, fullPage: true });
  await page.screenshot({ path: `${output}/home-desktop-top.png` });
  await page.locator(".latest-section").screenshot({ path: `${output}/journal-section.png` });
  await page.locator(".spotlight-section").screenshot({ path: `${output}/spotlight-section.png` });
  await page.locator(".guides-section").screenshot({ path: `${output}/guides-section.png` });
  await page.locator(".writers-section").screenshot({ path: `${output}/writers-section.png` });
  await page.locator(".newsletter-section").screenshot({ path: `${output}/newsletter-section.png` });
  const imageFailures = await page.locator("img").evaluateAll((images) => images.filter((img) => !img.naturalWidth).map((img) => img.alt));
  const layouts = [];
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    layouts.push(await page.evaluate(() => ({ width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, banner: document.querySelector("#home-banner")?.getBoundingClientRect().width, contentSections: document.querySelectorAll("main > section[data-home-section]").length })));
    if (width === 390) {
      await page.screenshot({ path: `${output}/home-mobile.png`, fullPage: true });
      await page.screenshot({ path: `${output}/home-mobile-top.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  console.log(JSON.stringify({ baseURL, output, layouts, imageFailures, errors }, null, 2));
  await page.goto(`${baseURL}/blog/the-art-of-finding-joy-in-the-everyday`, { waitUntil: "domcontentloaded" });
  await page.locator(".magazine-cover").waitFor();
  await page.locator(".magazine-cover").evaluate((img) => img.decode().catch(() => {}));
  await page.screenshot({ path: `${output}/article-desktop.png`, fullPage: true });
  console.log(JSON.stringify({ articleCaptured: true, errors }, null, 2));
} finally {
  await browser.close();
}
