import { expect, test } from '@playwright/test'

test('SSR', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByText('try editing src/routes/+page.svelte')
  ).toBeVisible()
  await expect(page.getByTestId('hydrated')).toBeAttached()
  await page.getByLabel('Increase the counter by one').click()
  await expect(page.getByText('2')).toBeVisible()

  await page.goto('/sverdle/how-to-play')
  await expect(
    page.getByRole('heading', { name: 'How to play Sverdle' })
  ).toBeVisible()
})

test('SPA', async ({ page }) => {
  await page.goto('/sverdle/how-to-play')
  await expect(
    page.getByRole('heading', { name: 'How to play Sverdle' })
  ).toBeVisible()

  await page.goto('/')
  await expect(
    page.getByText('try editing src/routes/+page.svelte')
  ).toBeVisible()
  await page.getByLabel('Increase the counter by one').click()
  await expect(page.getByText('2')).toBeVisible()
})

test('SSG', async ({ page }) => {
  await page.goto('/about')
  await expect(
    page.getByRole('heading', { name: 'About this app' })
  ).toBeVisible()

  await page.goto('/')
  await expect(
    page.getByText('try editing src/routes/+page.svelte')
  ).toBeVisible()
  await page.getByLabel('Increase the counter by one').click()
  await expect(page.getByText('2')).toBeVisible()
})

test('SSG Routing', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByText('try editing src/routes/+page.svelte')
  ).toBeVisible()
  await expect(page.getByTestId('hydrated')).toBeAttached()
  await page.getByLabel('Increase the counter by one').click()
  await expect(page.getByText('2')).toBeVisible()

  await page.goto('/about')
  await expect(
    page.getByRole('heading', { name: 'About this app' })
  ).toBeVisible()
})
