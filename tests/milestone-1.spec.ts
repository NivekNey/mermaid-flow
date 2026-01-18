import { test, expect } from '@playwright/test';

test.describe('Milestone 1: Foundation', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));
    page.on('pageerror', err => console.error(`[Browser Error] ${err.message}`));
    await page.goto('/');
  });

  test('should render the app shell correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Mermaid/);
    await expect(page.getByRole('heading', { name: 'MermaidFlow' })).toBeVisible();
    
    // Check for split panes
    await expect(page.getByText('Code Editor')).toBeVisible();
    await expect(page.locator('.svelte-flow')).toBeVisible();
  });

  test('should handle theme toggling', async ({ page }) => {
    // Default should be dark mode
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle theme
    await page.getByRole('button', { name: 'Toggle Theme' }).click();
    
    // Should remove dark class
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Toggle back
    await page.getByRole('button', { name: 'Toggle Theme' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should sync state to URL', async ({ page }) => {
    const editor = page.locator('textarea');
    const initialHash = page.url().split('#')[1];
    
    // Type new code
    await editor.fill('graph TD\n  C --> D');
    
    // Wait for debounce (250ms)
    await page.waitForTimeout(500);
    
    // Check hash changed
    const newHash = page.url().split('#')[1];
    expect(newHash).not.toBe(initialHash);
    expect(newHash).toBeTruthy();
  });

  test('should restore state from URL', async ({ page }) => {
    // Navigate to a URL with a known state
    // Let's manually create a state or use the previous test's logic implicitly.
    // Easier: Just type something, get the hash, reload.
    
    const editor = page.locator('textarea');
    const uniqueText = 'graph TD\n  TestNode --> RestoreNode';
    await editor.fill(uniqueText);
    await page.waitForTimeout(500);
    
    const hash = page.url().split('#')[1];
    
    // Reload with hash
    await page.goto(`/#${hash}`);
    
    // Check editor content
    await expect(editor).toHaveValue(uniqueText);
  });
});
