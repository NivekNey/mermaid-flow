import { test, expect } from '@playwright/test';

test.describe('Milestone 3: Editor & Parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForSelector('h1:has-text("MermaidFlow")');
  });

  test('should parse flowchart and render nodes', async ({ page }) => {
    const editor = page.locator('textarea');
    
    // Clear and type new mermaid code
    await editor.fill('flowchart TD\n  A[Start] --> B[End]');
    
    // Wait for debounce and layout
    await page.waitForTimeout(1000);
    
    // Check if nodes are rendered in Svelte Flow
    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(2);
    
    await expect(nodes.filter({ hasText: 'Start' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'End' })).toBeVisible();
  });

  test('should handle invalid mermaid code gracefully', async ({ page }) => {
    const editor = page.locator('textarea');
    
    // Valid code first
    await editor.fill('flowchart TD\n  A --> B');
    await page.waitForTimeout(1000);
    let nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(2);
    
    // Invalid code
    await editor.fill('flowchart TD\n  A ---');
    await page.waitForTimeout(1000);
    
    // Should still have previous nodes or at least not crash
    // Based on our implementation, it returns null and keeps old nodes
    await expect(nodes).toHaveCount(2);
  });

  test('should support different shapes/labels', async ({ page }) => {
    const editor = page.locator('textarea');
    await editor.fill('flowchart LR\n  Step1[First Step] --> Step2{Decision}');
    await page.waitForTimeout(1000);
    
    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(2);
    await expect(nodes.filter({ hasText: 'First Step' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'Decision' })).toBeVisible();
  });
});
