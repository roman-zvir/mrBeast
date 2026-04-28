const { test, expect } = require("@playwright/test");
const path = require("node:path");

const pagePath = path.resolve(__dirname, "../../public/index.html");
const pageUrl = `file://${pagePath}`;

test("MVP page renders", async ({ page }) => {
  await page.goto(pageUrl);
  await expect(page.getByRole("heading", { name: "MrZvir" })).toBeVisible();
  await expect(page.locator("#status")).toHaveText("Welcome, Guest!");
});

test("CTA click updates status", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole("button", { name: "Click me" }).click();
  await expect(page.locator("#status")).toHaveText("You clicked the MVP button.");
});
