import { test, expect } from '@playwright/test';

test('MVP page renders dashboard shell', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'MrZvir' })).toBeVisible();
  await expect(page.locator('#env-status')).toContainText(
    /Development|Production/
  );
  await expect(page.locator('#task-list .task-item')).toHaveCount(2);
  await expect(page.locator('#metrics-grid .metric-card')).toHaveCount(6);
  await expect(page.locator('#observability-status')).toContainText(
    'Source maps enabled'
  );
});

test('CTA click updates status', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Click me' }).click();
  await expect(page.locator('#status')).toHaveText(
    'You clicked the MVP button.'
  );
});

test('task can be created and completed', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Task title').fill('Verify observability alerts');
  await page.getByLabel('Priority').selectOption('high');
  await page.getByLabel('Category').selectOption('ops');
  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByText('Verify observability alerts')).toBeVisible();

  const createdTask = page.locator('#task-list .task-item').filter({
    has: page.getByText('Verify observability alerts')
  });

  await createdTask.getByRole('button', { name: 'Complete' }).click();
  await expect(createdTask).toHaveClass(/completed/);
});
