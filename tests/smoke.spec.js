import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads hero, slider, and navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero-title')).toBeVisible()
    await expect(page.locator('#sliderTrack .slide')).toHaveCount(6)
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page).toHaveTitle(/Baatryn/i)
  })

  test('language switcher switches to EN', async ({ page }) => {
    await page.goto('/')
    await page.locator('#langBtn').click()
    await expect(page.locator('#langMenu')).toHaveClass(/open/)
    await page.locator('#langMenu button[data-lang="en"]').click()
    await expect(page).toHaveURL(/\?lang=en/)
    await expect(page.locator('.hero-subtitle span')).toContainText(/Poker Club/i)
  })

  test('header buttons are clickable (z-index)', async ({ page }) => {
    await page.goto('/')
    const langBtn = page.locator('#langBtn')
    await expect(langBtn).toBeVisible()
    await langBtn.click()
    await expect(page.locator('#langMenu')).toHaveClass(/open/)
  })
})

test.describe('Articles', () => {
  test('MN article page loads', async ({ page }) => {
    await page.goto('/articles/bluff-poker-mongolia/')
    await expect(page.locator('.article-title')).toBeVisible()
    await expect(page.locator('.article-body')).toBeVisible()
  })

  test('EN article page loads', async ({ page }) => {
    await page.goto('/en/articles/bluff-poker-mongolia/')
    await expect(page.locator('.article-title')).toBeVisible()
  })

  test('articles index lists cards', async ({ page }) => {
    await page.goto('/articles/')
    await expect(page.locator('.article-grid .article-card').first()).toBeVisible()
  })

  test('article lang switcher links to EN version', async ({ page }) => {
    await page.goto('/articles/bluff-poker-mongolia/')
    await page.locator('#langBtn').click()
    await page.locator('#langMenu a[data-lang="en"]').click()
    await expect(page).toHaveURL(/\/en\/articles\/bluff-poker-mongolia\//)
  })
})

test.describe('Internal navigation', () => {
  test('homepage link to article works', async ({ page }) => {
    await page.goto('/')
    await page.locator('a[data-article-group="holdem-vs-omaha"]').click()
    await expect(page).toHaveURL(/\/articles\/holdem-vs-omaha\//)
    await expect(page.locator('.article-title')).toBeVisible()
  })
})
