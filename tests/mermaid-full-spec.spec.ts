import { test, expect } from '@playwright/test';

test.describe('Mermaid Full Specification Support', () => {
  test.beforeEach(async ({ page }) => {
    // page.on('console', msg => console.log('BROWSER:', msg.text()));
    await page.goto('/');
    await page.waitForSelector('h1:has-text("MermaidFlow")');
    // Give it a bit more time to hydrate
    await page.waitForTimeout(1000);
  });

  test('should handle all core node shapes', async ({ page }) => {
    const editor = page.locator('textarea');
    const shapes = [
      { code: 'A[Rect]', label: 'Rect' },
      { code: 'B(Round)', label: 'Round' },
      { code: 'C([Stadium])', label: 'Stadium' },
      { code: 'D[[Subroutine]]', label: 'Subroutine' },
      { code: 'E[(Database)]', label: 'Database' },
      { code: 'F((Circle))', label: 'Circle' },
      { code: 'G>Asymmetric]', label: 'Asymmetric' },
      { code: 'H{Rhombus}', label: 'Rhombus' },
      { code: 'I{{Hexagon}}', label: 'Hexagon' },
      { code: 'J[/Parallelogram/]', label: 'Parallelogram' },
      { code: 'K[\\Parallelogram\\]', label: 'Parallelogram' },
      { code: 'L[/Trapezoid\\]', label: 'Trapezoid' },
      { code: 'M[\\Trapezoid/]', label: 'Trapezoid' },
      { code: 'N(((Double Circle)))', label: 'Double Circle' },
    ];

    const mermaidCode = `flowchart TD\n${shapes.map(s => `    ${s.code}`).join('\n')}`;
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(shapes.length);

    for (const shape of shapes) {
      if (shape.label === 'Circle') {
         await expect(page.locator('[data-id="F"]')).toContainText('Circle');
      } else {
         // Use exact match or check by ID to avoid ambiguity
         const nodeId = shape.code.charAt(0);
         await expect(page.locator(`[data-id="${nodeId}"]`)).toBeVisible();
      }
    }
  });

  test('should handle new v11.3+ shape syntax', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    AAA@{ shape: rect, label: "New Rect" }
    BBB@{ shape: diamond, label: "New Diamond" }
    CCC@{ shape: cloud, label: "Cloud" }
    DDD@{ shape: cylinder, label: "Cylinder" }
    EEE@{ shape: doc, label: "Document" }
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(5);
    await expect(nodes.filter({ hasText: 'New Rect' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'Cloud' })).toBeVisible();
  });

  test('should handle all link variations and decorations', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart LR
    L1 --- L2
    L3 -- open --- L4
    L5 --> L6
    L7 -- arrow --> L8
    L9 --o L10
    L11 --x L12
    L13 <--> L14
    L15 o--o L16
    L17 x--x L18
    L19 -.-> L20
    L21 ==> L22
    L23 ~~~ L24
    L25 -- "multi-word" --> L26
    L27 -- "inline" --> L28
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(28);

    const edges = page.locator('.svelte-flow__edge');
    const edgeCount = await edges.count();
    expect(edgeCount).toBeGreaterThanOrEqual(13);

    await expect(page.locator('text=multi-word')).toBeVisible();
    await expect(page.locator('text=inline')).toBeVisible();
  });

  test('should handle advanced syntax: variable length, chaining, multi-targets', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    V1 ---> V2
    V3 ----> V4
    C1 --> C2 --> C3
    M1 & M2 --> M3 & M4
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(11);

    const edges = page.locator('.svelte-flow__edge');
    await expect(edges).toHaveCount(8);
  });

  test('should handle styling, classes and interactivity syntax without crashing', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    S1:::redNode --> S2
    style S2 fill:#f9f,stroke:#333
    classDef redNode fill:#f00,color:#fff
    click S1 "https://example.com" "Tooltip"
    linkStyle 0 stroke:#ff3,stroke-width:4px
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(2);
    await expect(nodes.filter({ hasText: 'S1' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'S2' })).toBeVisible();
  });

  test('should handle markdown and special formatting', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
flowchart TD
    MD1["\`**Bold** *Italic*\`"]
    MD2["Line 1<br/>Line 2"]
    MD3["Unicode ☺"]
    MD4["HTML entities &hearts;"]
    MD1 --> MD2 & MD3 & MD4
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(4);
    await expect(nodes.filter({ hasText: 'Line 1' })).toBeVisible();
    await expect(nodes.filter({ hasText: 'Unicode ☺' })).toBeVisible();
  });

  test('should handle graph keyword and semicolons', async ({ page }) => {
    const editor = page.locator('textarea');
    const mermaidCode = `
graph LR;
    G1[Start] --> G2(Middle);
    G2 --> G3{End};
    `;
    
    await editor.fill(mermaidCode);
    await page.waitForTimeout(3000);

    const nodes = page.locator('.svelte-flow__node');
    await expect(nodes).toHaveCount(3);
    await expect(nodes.filter({ hasText: 'Start' })).toBeVisible();
  });
});