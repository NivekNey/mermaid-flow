import { test, expect } from '@playwright/test';

test.describe('Mermaid Extended Syntax Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1:has-text("MermaidFlow")');
  });

  test('should handle advanced arrow types', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart LR
    A <--> B
    C --o D
    E --x F
    G o--o H
    I x--x J
    K o--x L
    M -- double arrow --- N
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(14);

    const edges = page.locator('.svelte-flow__edge');
    await expect(edges).toHaveCount(7);
  });

  test('should handle markdown and special characters in labels', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    A["Line 1<br>Line 2"]
    B["Unicode: ☺ ☻ ☘"]
    C["Markdown **Bold** and *Italic*"]
    D["Special: !@#$%^&*()_+"]
    A --> B
    C --> D
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(4);

    // We check if the labels are present
    // Note: Mermaid/SvelteFlow might render <br> as newline or keep it as text depending on implementation
    await expect(nodes.filter({ hasText: 'Unicode: ☺ ☻ ☘' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'Special: !@#$%^&*()_+' })).toBeVisible();
  });

  test('should handle nested subgraphs', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    subgraph Parent
        direction LR
        subgraph Child1
            A --> B
        end
        subgraph Child2
            C --> D
        end
        B --> C
    end
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(4); // A, B, C, D
    
    const edges = page.locator('.svelte-flow__edge');
    await expect(edges).toHaveCount(3); // A->B, C->D, B->C
  });

  test('should handle styling and classes without crashing', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    A:::someClass --> B
    classDef someClass fill:#f9f,stroke:#333,stroke-width:4px
    style B fill:#bbf,stroke:#f66,stroke-dasharray: 5 5
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(2);
    
    // We don't necessarily support the styling yet, but it shouldn't break the parser
    await expect(nodes.filter({ hasText: 'A' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'B' })).toBeVisible();
  });

  test('should handle all directions', async ({ page }) => {
    const editor = page.locator('textarea');
    const directions = ['TB', 'TD', 'BT', 'RL', 'LR'];
    
    for (const dir of directions) {
      await editor.fill(`flowchart ${dir}\n  Start --> End`);
      await page.waitForTimeout(1000);
      
      const nodes = page.locator('.svelte-flow__node');
      await expect(nodes).toHaveCount(2, { message: `Failed for direction ${dir}` });
      await expect(nodes.filter({ hasText: 'Start' })).toBeVisible();
      await expect(nodes.filter({ hasText: 'End' })).toBeVisible();
    }
  });

  test('should handle multi-node connections in depth', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    A & B --> C & D
    E --> F & G & H --> I
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(2000);

    // Nodes: A, B, C, D, E, F, G, H, I = 9
    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(9);

    // Edges:
    // A->C, A->D, B->C, B->D (4)
    // E->F, E->G, E->H (3)
    // F->I, G->I, H->I (3)
    // Total = 10
    const edges = page.locator('.svelte-flow__edge');
    await expect(edges).toHaveCount(10);
  });
});
