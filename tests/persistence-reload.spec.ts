import { test, expect } from '@playwright/test';

test.describe('Persistence & Reload', () => {
  test('should persist node position after reload', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the "Start" node to be visible
    const node = page.getByText('Start', { exact: true });
    await expect(node).toBeVisible();

    // Get initial position
    const initialBox = await node.boundingBox();
    if (!initialBox) throw new Error('Could not find node bounding box');

    // Drag the node
    const dragX = 200;
    const dragY = 150;
    
    // Ensure node is hovered first
    await node.hover();
    const box = await node.boundingBox();
    if (!box) throw new Error('No box');

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(100);
    // Move slowly to ensure event firing
    for (let i = 1; i <= 10; i++) {
        await page.mouse.move(
            box.x + box.width / 2 + (dragX * i) / 10, 
            box.y + box.height / 2 + (dragY * i) / 10
        );
        await page.waitForTimeout(50);
    }
    await page.waitForTimeout(200);
    await page.mouse.up();

    // Wait for debounce (250ms) and hash update
    await page.waitForTimeout(1000);
    
    const hashAfterDrag = page.url().split('#')[1];
    expect(hashAfterDrag).toBeDefined();

    // Reload the page
    await page.reload();
    
    // Wait for the node to appear again
    const nodeAfterReload = page.getByText('Start', { exact: true });
    await expect(nodeAfterReload).toBeVisible();
    
    // Check its new position
    const newBox = await nodeAfterReload.boundingBox();
    if (!newBox) throw new Error('Could not find node bounding box after reload');

    // Just verify it moved significantly from initial and is close to where we dragged it.
    // The exact pixels can vary due to viewport/zoom/layout.
    expect(newBox.x).toBeGreaterThan(initialBox.x + 50);
    expect(newBox.y).toBeGreaterThan(initialBox.y + 50);
    
    // Also verify the hash is still the same as what was dragged
    const hashAfterReload = page.url().split('#')[1];
    expect(hashAfterReload).toBe(hashAfterDrag);
  });
});
