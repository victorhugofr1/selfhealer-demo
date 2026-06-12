import { test, expect } from "@playwright/test";

test("login", async ({ page }) => {
  await page.goto("https://example.com");
  await page.click("#login-btn-fixed");
});
