import { test, expect } from '@playwright/test';

test.describe('Mermaid Syntax Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1:has-text("MermaidFlow")');
  });

  test('should handle various node label syntaxes', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    id1[Node with square brackets]
    id2(Node with round edges)
    id3([Node in stadium shape])
    id4[[Node in subroutine shape]]
    id5[(Node in database shape)]
    id6((Node in circle shape))
    id7>Node in flag shape]
    id8{Node in diamond shape}
    id9{{Node in hexagon shape}}
    id10[/Node in parallelogram shape/]
    id11[\\Node in parallelogram shape\\]
    id12[/Node in trapezoid shape\\]
    id13[\\Node in trapezoid shape/]
    id14["Node with quotes and special characters: !@#$%^&*()"]
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    // We expect 14 nodes
    await expect(nodes).toHaveCount(14);

    // Verify some specific labels
    await expect(nodes.filter({ hasText: 'Node with square brackets' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'Node in circle shape' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'Node with quotes and special characters: !@#$%^&*()' })).toBeVisible();
  });

  test('should handle various edge styles and labels', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart LR
    A -- simple line --- B
    B --> C
    C -- label --> D
    D -.-> E
    E ==> F
    F -- label --- G
    G -- "quoted label" --- H
    I --x J
    K --o L
    M -- "arrow with label" --> N
    O -. "dotted with label" .-> P
    Q == "thick with label" ==> R
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(18); // A to R

    // Check if edges exist - Svelte Flow renders them as paths
    const edges = page.locator('.svelte-flow__edge');
    // 12 edges in the code
    await expect(edges).toHaveCount(12);

    // Check if edge labels are rendered
    await expect(page.locator('text=simple line')).toBeVisible();
    await expect(page.locator('text=quoted label')).toBeVisible();
    await expect(page.locator('text=arrow with label')).toBeVisible();
  });

  test('should handle chained and multi-node connections', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    A --> B --> C & D --> E
    F & G --> H & I
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    // A, B, C, D, E, F, G, H, I = 9 nodes
    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(9);

    // Connections:
    // A->B (1)
    // B->C (2)
    // B->D (3)
    // C->E (4)
    // D->E (5)
    // F->H (6)
    // F->I (7)
    // G->H (8)
    // G->I (9)
    const edges = page.locator('.svelte-flow__edge');
    await expect(edges).toHaveCount(9);
  });

  test('should handle subgraphs', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    subgraph Top
        AA --> BB
    end
    subgraph Bottom
        CC --> DD
    end
    BB --> CC
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    // Currently we don't explicitly support subgraph rendering as containers
    // But we should at least see the nodes inside them
    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes.filter({ hasText: 'AA' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'BB' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'CC' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'DD' })).toBeVisible();
    
    // Check connections
    const edges = page.locator('.svelte-flow__edge');
    await expect(edges).toHaveCount(3); // AA->BB, CC->DD, BB->CC
  });

  test('should handle comments and direction changes', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart RL
    %% This is a comment
    AAA --> BBB
    CCC --> DDD
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(4);
    
    // Check direction RL (Right to Left)
    // Node AAA should be to the right of Node BBB
    const boxAAA = await nodes.filter({ hasText: 'AAA' }).boundingBox();
    const boxBBB = await nodes.filter({ hasText: 'BBB' }).boundingBox();
    
    if (boxAAA && boxBBB) {
        expect(boxAAA.x).toBeGreaterThan(boxBBB.x);
    }
  });
});
