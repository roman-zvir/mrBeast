import { test, expect } from '@playwright/test';

test('MVP page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'MrZvir' })).toBeVisible();
  await expect(page.locator('#status')).toHaveText('Welcome, Guest!');
});

test('CTA click updates status', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.locator('#status')).toHaveText(
    'You clicked the MVP button.'
  );
});
