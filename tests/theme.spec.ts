import { test, expect } from '@playwright/test';

test.describe('Theme & Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should apply dark mode styles correctly', async ({ page }) => {
    // 1. Ensure we start in Dark Mode (default in store)
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Check Main Background Color (tailwind gray-950)
    // gray-950 is rgb(3, 7, 18) or oklch(0.13...)
    const main = page.locator('main');
    await expect(main).toHaveCSS('background-color', /(rgb\(3, 7, 18\)|oklch\(0\.13)/);

    // Check Editor Background Color (gray-900)
    // gray-900 is rgb(17, 24, 39) or oklch(0.21...)
    const editor = page.locator('textarea');
    await expect(editor).toHaveCSS('background-color', /(rgb\(17, 24, 39\)|oklch\(0\.2[0-2])/);

    // Check Text Color (tailwind gray-100)
    // gray-100 is rgb(243, 244, 246) or oklch(0.96...)
    await expect(main).toHaveCSS('color', /(rgb\(243, 244, 246\)|oklch\(0\.9[67])/);

    // 2. Toggle to Light Mode
    await page.getByRole('button', { name: 'Toggle Theme' }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Check Main Background Color (white is rgb(255, 255, 255))
    await expect(main).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    
    // Check Editor Background Color in Light Mode (gray-50)
    // gray-50 is rgb(249, 250, 251) or oklch(0.98...)
    await expect(editor).toHaveCSS('background-color', /(rgb\(249, 250, 251\)|oklch\(0\.9[89])/);
    
    // Check Text Color (gray-900)
    // gray-900 is rgb(17, 24, 39) or oklch(0.21...)
    await expect(main).toHaveCSS('color', /(rgb\(17, 24, 39\)|oklch\(0\.2[0-2])/);
  });

  test('nodes should be visible and themed in dark mode', async ({ page }) => {
    // Ensure Dark Mode
    if (!await page.locator('html').getAttribute('class').then(c => c?.includes('dark'))) {
        await page.getByRole('button', { name: 'Toggle Theme' }).click();
    }
    
    // Check a node's style
    const startNode = page.getByText('Start', { exact: true });
    await expect(startNode).toBeVisible();
    
    // Check if the node has the dark mode background color
    // We set it to #1f2937 in FlowCanvas.svelte, which converts to rgb(31, 41, 55)
    // Note: The element with the background color is likely the parent .svelte-flow__node-default
    const nodeElement = page.locator('.svelte-flow__node-default').first();
    await expect(nodeElement).toHaveCSS('background-color', 'rgb(31, 41, 55)');
    
    // Check text color #f3f4f6 -> rgb(243, 244, 246)
    await expect(nodeElement).toHaveCSS('color', 'rgb(243, 244, 246)');
  });
});
