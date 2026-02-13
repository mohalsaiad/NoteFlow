import { test, expect } from '@playwright/test';

test('user can register and login', async ({ page }) => {
  await page.goto('/register');

  const username = `user_${Date.now()}`;
  const password = 'password123';

  await page.locator('[formcontrolname="username"]').fill(username);
  await page.locator('[formcontrolname="password"]').fill(password);
  await page.locator('[formcontrolname="confirmPassword"]').fill(password);

  await page.getByRole('button', { name: /register/i }).click();

  await expect(page).toHaveURL(/login/);

  await page.locator('[formcontrolname="username"]').fill(username);
  await page.locator('[formcontrolname="password"]').fill(password);

  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/notes/);
});
