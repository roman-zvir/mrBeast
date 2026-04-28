const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:5173",
    headless: true
  },
  webServer: {
    command: "npx http-server . -p 5173 -c-1",
    url: "http://127.0.0.1:5173/public/index.html",
    reuseExistingServer: true
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]]
});
