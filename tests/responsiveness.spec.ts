import { test, expect } from '@playwright/test';

test.describe('Responsiveness & Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for nodes to render
    await expect(page.locator('.svelte-flow__node').first()).toBeVisible();
  });

  test('nodes should not have "transition: all" which causes drag lag', async ({ page }) => {
    // Select the first node
    const node = page.locator('.svelte-flow__node').first();
    
    // Get the inline style or computed style
    // The style is applied via the `style` attribute in the Node object, which Svelte Flow renders inline.
    // However, it might be inside the inner div depending on type.
    // Default nodes usually put the style on the wrapper.
    
    // Let's check the style attribute directly first
    const styleAttribute = await node.getAttribute('style');
    
    // We want to ensure 'transition: all' is NOT present, or at least 'transform' is not being transitioned.
    // But my code specifically sets 'transition: all 0.2s'.
    
    // The test expects that we should NOT see 'transition: all' or the shorthand 'transition: 0.2s' (which implies all)
    // Checking for 'transition: ...s' where the property isn't specified implies 'all'.
    expect(styleAttribute).not.toMatch(/transition:\s*(all\s*)?[\d\.]+s/);
  });
});
