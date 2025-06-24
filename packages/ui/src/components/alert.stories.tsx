import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert"; // adjust if path differs

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    a11y: {
      config: { rules: [{ id: "wcag21aa", enabled: true }] }
    }
  },
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Success: Story = {
  args: {
    variant: "success",
    children: "Saved successfully!"
  }
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Something went wrong."
  }
};
