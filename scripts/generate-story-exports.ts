#!/usr/bin/env ts-node
/**
 * generate-story-exports.ts
 * -----------------------------------------
 * Utility script to ensure every React component in `packages/ui/src/components` 
 * has a corresponding Storybook CSF file. If a `.stories.tsx` file is missing, 
 * a minimal WCAG‑aware stub is created next to the component.
 *
 * How to run:
 *   pnpm exec ts-node scripts/generate-story-exports.ts
 *
 * NOTE: This does not override existing stories. It only scaffolds new ones.
 */
import { promises as fs } from 'fs';
import path from 'path';

const COMPONENT_DIR = path.resolve(__dirname, '../packages/ui/src/components');
const STORY_TEMPLATE = (compName: string, variant = 'primary') => `import type { Meta, StoryObj } from "@storybook/react";
import { ${compName} } from "./${compName}";

const meta: Meta<typeof ${compName}> = {
  title: "UI/${compName}",
  component: ${compName},
  parameters: {
    a11y: { config: { rules: [{ id: "wcag21aa", enabled: true }] } }
  },
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof ${compName}>;

export const Default: Story = {
  args: { /* TODO: add meaningful defaults */ }
};
`;

async function ensureStories() {
  const files = await fs.readdir(COMPONENT_DIR);
  for (const file of files) {
    if (!file.endsWith('.tsx') || file.endsWith('.stories.tsx')) continue;
    const compName = path.parse(file).name;
    const storyPath = path.join(COMPONENT_DIR, `${compName}.stories.tsx`);
    try {
      await fs.access(storyPath);
      // Story exists; skip.
    } catch {
      // Create stub story.
      console.log(`📝  Creating story for ${compName}`);
      await fs.writeFile(storyPath, STORY_TEMPLATE(compName));
    }
  }
  console.log('✅ Story generation complete');
}

ensureStories().catch(err => {
  console.error('Story generation failed', err);
  process.exit(1);
});
