import { expect, test } from '@playwright/test'

test('Form Test', async ({ page }) => {
  await page.goto('/sverdle')
  await expect(page.getByText('How to play')).toBeVisible()
  await expect(page.getByTestId('hydrated')).toBeAttached()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const _ of new Array(6).fill(0).map((_, i) => i)) {
    await expect(page.locator('div.letter.selected')).toBeVisible()
    await page.keyboard.press('s')
    await page.keyboard.press('e')
    await page.keyboard.press('r')
    await page.keyboard.press('v')
    await page.keyboard.press('e')
    await page.keyboard.press('Enter')
  }

  await expect(page.getByText('game over')).toBeVisible()
})
