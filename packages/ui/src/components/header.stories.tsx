import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header"; // adjust path if necessary

const meta: Meta<typeof Header> = {
  title: "UI/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: { rules: [{ id: "wcag21aa", enabled: true }] }
    }
  },
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  args: {
    cartCount: 0,
    user: null
  }
};

export const LoggedInWithCart: Story = {
  args: {
    cartCount: 3,
    user: { name: "Jane Doe" }
  }
};
