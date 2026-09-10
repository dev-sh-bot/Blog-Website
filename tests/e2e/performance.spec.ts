import { expect, test } from "@playwright/test";

type Metrics = { lcp: number; cls: number; inp: number };

test.use({ viewport: { width: 390, height: 844 } });

test("homepage stays within the Core Web Vitals budget", async ({ page }) => {
  await page.addInitScript(() => {
    const metrics: Metrics = { lcp: 0, cls: 0, inp: 0 };
    (window as Window & { __insightlyMetrics?: Metrics }).__insightlyMetrics = metrics;
    new PerformanceObserver((list) => { const entries = list.getEntries(); const last = entries[entries.length - 1]; if (last) metrics.lcp = last.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries() as PerformanceEntryList & { getEntries: () => Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }> }) { const layout = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }; if (!layout.hadRecentInput) metrics.cls += layout.value ?? 0; } }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) metrics.inp = Math.max(metrics.inp, entry.duration); }).observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => (window as Window & { __insightlyMetrics?: Metrics }).__insightlyMetrics ?? { lcp: 0, cls: 0, inp: 0 });
  expect(metrics.lcp, `LCP was ${metrics.lcp}ms`).toBeGreaterThan(0);
  expect(metrics.lcp, `LCP was ${metrics.lcp}ms`).toBeLessThan(2500);
  expect(metrics.cls, `CLS was ${metrics.cls}`).toBeLessThan(0.1);
  expect(metrics.inp, `interaction event duration was ${metrics.inp}ms`).toBeLessThan(200);
});
