import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, writeFileSync } from 'node:fs';

test('navigation, direct links, keyboard and truthful sample actions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A little clarity for payday');
  await expect(page.getByText('Sample data • Changes are not saved.')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  for (const name of ['Plan', 'Activity', 'Goals', 'Learn', 'Home']) {
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  for (const path of ['/plan/review','/transactions/new','/goals/personal-cushion','/learn/envelopes','/learn/cash-flow','/settings','/household','/onboarding']) {
    await page.goto(path); await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Loading your sample workspace…')).not.toBeVisible();
  }
  await page.goto('/plan/review');
  await expect(page.getByRole('button', { name: 'Accept allocations — unavailable in sample' })).toBeDisabled();
  await expect(page.getByText(/not an implemented allocation engine/)).toBeVisible();
  await page.getByText('Why this amount?', { exact: true }).first().click();
  await expect(page.getByText('Sample rent due October 24 comes first.')).toBeVisible();
});

test('validation, draft cancellation and workspace privacy/reset', async ({ page }) => {
  await page.goto('/activity');
  await page.getByRole('link', { name: 'Try an expense entry' }).click();
  await page.getByLabel('Amount in USD').fill('1.001');
  await page.getByLabel('Posted date').fill('2026-02-29');
  await page.getByRole('button', { name: 'Check sample entry' }).click();
  await expect(page.getByLabel('Amount in USD')).toBeFocused();
  await expect(page.getByLabel('Amount in USD')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Amount in USD').fill('12.50');
  await page.getByLabel('Posted date').fill('2026-10-22');
  await page.getByRole('button', { name: 'Check sample entry' }).click();
  await expect(page.getByText('Sample entry is valid. Nothing was saved or posted.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save expense — unavailable in sample' })).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel entry' }).click();
  await page.getByRole('button', { name: 'Keep editing' }).click();
  await expect(page.getByLabel('Amount in USD')).toHaveValue('12.50');
  await page.goBack();
  await expect(page.getByRole('dialog', { name: 'Discard this unsaved sample draft?' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep editing draft' }).click();
  await expect(page.getByLabel('Amount in USD')).toHaveValue('12.50');
  await page.getByRole('button', { name: 'Alex Morgan, account options' }).click();
  await page.getByRole('button', { name: 'Switch workspace', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Alex Morgan, account options' })).toBeFocused();
  await page.getByRole('button', { name: 'Alex Morgan, account options' }).click();
  await page.getByRole('button', { name: 'Switch workspace', exact: true }).click();
  await page.getByRole('button', { name: 'Discard and open Household sample' }).click();
  await expect(page.getByText('Household sample', { exact: true }).first()).toBeVisible();
  await page.goto('/transactions/new'); // reload intentionally resets to the personal sample
  await expect(page.getByLabel('Amount in USD')).toHaveValue('');
  await page.getByRole('button', { name: 'Alex Morgan, account options' }).click();
  await page.getByRole('button', { name: 'Switch workspace', exact: true }).click();
  await page.getByRole('button', { name: 'Discard and open Household sample' }).click();
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Goals', exact: true }).click();
  await expect(page.getByText('No shared goals yet')).toBeVisible();
  await page.evaluate(() => { history.pushState({}, '', '/goals/personal-cushion'); window.dispatchEvent(new PopStateEvent('popstate')); });
  await expect(page.getByText('Goal unavailable in this workspace.')).toBeVisible();
  await expect(page.getByText('A little breathing room', { exact: true })).toHaveCount(0);
});

test('activity filtering, error recovery, lessons and reload disclosure', async ({ page }) => {
  await page.goto('/activity');
  await page.getByLabel('Entry type').selectOption('expense');
  await expect(page.getByText('Fictional groceries', { exact: true })).toBeVisible();
  await expect(page.getByText('Fictional settled pay', { exact: true })).toHaveCount(0);
  await page.getByLabel('Search activity').fill('unmatched');
  await expect(page.getByRole('heading', { name: 'No activity to show' })).toBeVisible();
  await page.getByRole('button', { name: 'Preview recoverable error' }).click();
  await page.getByRole('button', { name: 'Retry activity' }).click();
  await page.goto('/learn');
  await expect(page.locator('.lesson-grid .card')).toHaveCount(15);
  await page.getByRole('link', { name: 'Start sample lesson' }).click();
  await page.getByLabel('$15', { exact: true }).check();
  await expect(page.getByText(/That’s it/)).toBeVisible();
  await page.getByRole('button', { name: 'Mark sample complete' }).click();
  await expect(page.getByRole('button', { name: 'Sample completed' })).toBeDisabled();
  await expect(page.getByText(/Progress is in memory and resets on reload/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark sample complete' })).toBeEnabled();
});

test('responsive screenshots, reflow and automated accessibility', async ({ page }, testInfo) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/plan', '/plan/review', '/activity', '/learn', '/transactions/new']) {
      await page.goto(path); await expect(page.getByText('Loading your sample workspace…')).not.toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
      if (width !== 320) await page.screenshot({ path: testInfo.outputPath(`${width}-${path.replaceAll('/', '-') || 'home'}.png`), fullPage: true });
    }
    if (width === 390) {
      for (const label of ['Plan','Activity','Goals','Learn','Home']) await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: label, exact: true }).click();
    }
  }
  await page.setViewportSize({ width: 720, height: 1000 }); // layout equivalent to 1440px at 200% browser zoom
  await page.goto('/plan/review');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => document.documentElement.style.fontSize = '32px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('manifest, real PNGs, public cache exclusions and offline launch', async ({ page, context, request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone'); expect(manifest.id).toBe('/');
  for (const icon of manifest.icons) { const png = await (await request.get(icon.src)).body(); expect(png.readUInt32BE(16)).toBe(Number(icon.sizes.split('x')[0])); expect(png.subarray(1,4).toString()).toBe('PNG'); }
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  for (const path of ['/api/financial-probe','/auth/probe','/rest/probe','/rpc/probe','/exports/probe']) await page.evaluate(async path => { await fetch(path); }, path);
  const cached = await page.evaluate(async () => { const keys = await caches.keys(); return (await Promise.all(keys.map(async key => (await (await caches.open(key)).keys()).map(request => new URL(request.url).pathname)))).flat(); });
  expect(cached).toContain('/offline.html'); expect(cached.every(path => /^\/(assets\/|index.html|offline.html|manifest.webmanifest|icon-|maskable-)/.test(path))).toBe(true);
  expect(cached.some(path => /probe/.test(path))).toBe(false);
  expect(await page.evaluate(async () => ({ local: localStorage.length, session: sessionStorage.length, db: await indexedDB.databases() }))).toMatchObject({ local: 0, session: 0, db: [] });
  await context.setOffline(true);
  await page.goto('/plan');
  await expect(page.getByRole('heading', { name: 'You’re offline' })).toBeVisible();
  await expect(page.getByText(/Connect to load your budget/)).toBeVisible();
  await context.setOffline(false);
});

test('service worker update waits for user confirmation', async ({ page }) => {
  const original = readFileSync('dist/sw.js', 'utf8');
  try {
    await page.goto('/'); await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload();
    writeFileSync('dist/sw.js', `${original}\n// update verification ${Date.now()}\n`);
    await page.evaluate(async () => { await (await navigator.serviceWorker.ready).update(); });
    await expect(page.getByRole('button', { name: 'Review update' })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Review update' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Keep current version' }).click();
    await expect(page.getByRole('button', { name: 'Review update' })).toBeVisible();
    await page.getByRole('button', { name: 'Review update' }).click();
    await page.getByRole('button', { name: 'Discard and update' }).click();
    await expect(page.getByRole('button', { name: 'Review update' })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  } finally { writeFileSync('dist/sw.js', original); }
});


test('named profile menu, keyboard dismissal and persistent accessible themes', async ({ page }, testInfo) => {
  test.setTimeout(60000);
  await page.goto('/');
  const profile = page.getByRole('button', { name: 'Alex Morgan, account options' });
  await profile.click();
  await expect(page.getByRole('button', { name: 'Switch workspace', exact: true })).toBeVisible();
  await page.getByRole('switch', { name: 'Dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('switch', { name: 'Dark mode' })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(profile).toBeFocused();
  await expect(profile).toHaveAttribute('aria-expanded', 'false');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/plan/review', '/activity', '/transactions/new', '/learn/envelopes', '/settings']) {
      await page.goto(path);
      await expect(page.getByText('Loading your sample workspace…')).not.toBeVisible();
      await profile.click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(results.violations).toEqual([]);
      if (path === '/' && width !== 320) await page.screenshot({ path: testInfo.outputPath(`profile-dark-${width}.png`), fullPage: true });
      await page.keyboard.press('Escape');
    }
  }
  await profile.click();
  await page.getByRole('switch', { name: 'Dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('.page-footer').click();
  await expect(profile).toHaveAttribute('aria-expanded', 'false');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['smartbudget-theme']);
});
