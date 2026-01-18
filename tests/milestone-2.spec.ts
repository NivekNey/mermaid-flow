import { test, expect } from '@playwright/test';

test.describe('Milestone 2: Visual Canvas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render Svelte Flow canvas', async ({ page }) => {
    // Check for Svelte Flow container
    await expect(page.locator('.svelte-flow')).toBeVisible();
    await expect(page.locator('.svelte-flow__controls')).toBeVisible();
  });

  test('should render nodes from default code', async ({ page }) => {
    // Default code: A[Start] --> B[End]
    // So we expect nodes with text "Start" and "End"
    await expect(page.getByText('Start', { exact: true })).toBeVisible();
    await expect(page.getByText('End', { exact: true })).toBeVisible();
    
    // Check edge exists
    await expect(page.locator('.svelte-flow__edge')).toBeAttached();
  });

  test('should update state on node drag', async ({ page }) => {
    // Get the initial hash
    const initialHash = page.url().split('#')[1];
    
    // Locate the 'Start' node
    const node = page.getByText('Start', { exact: true });
    
    // Get bounding box
    const box = await node.boundingBox();
    if (!box) throw new Error('Node not found');
    
    // Drag the node
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100);
    await page.mouse.up();
    
    // Wait for debounce (250ms) + small buffer
    await page.waitForTimeout(500);
    
    // Get new hash
    const newHash = page.url().split('#')[1];
    
    expect(newHash).not.toBe(initialHash);
    
    // Reload to verify persistence
    await page.reload();
    await page.waitForTimeout(500); // Wait for ELK/rendering
    
    // Check if the hash is still the same (state preserved)
    const reloadedHash = page.url().split('#')[1];
    expect(reloadedHash).toBe(newHash);
    
    // We can't easily check exact pixels without decoding the hash, 
    // but the fact the hash changed and persisted implies success.
  });
});
