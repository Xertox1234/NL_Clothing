import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button"; // adjust if path differs

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    a11y: {
      // Run axe on this story – Storybook a11y addon.
      config: { rules: [{ id: "wcag21aa", enabled: true }] }
    }
  },
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Click me"
  }
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled"
  }
};
