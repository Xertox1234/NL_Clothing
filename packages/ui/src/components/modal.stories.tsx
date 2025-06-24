import type { Meta, StoryObj } from "@storybook/react";
import { AccessibleModal } from "./AccessibleModal"; // adjust path if component file differs
import { useState } from "react";

const meta: Meta<typeof AccessibleModal> = {
  title: "UI/Modal",
  component: AccessibleModal,
  parameters: {
    a11y: {
      config: { rules: [{ id: "wcag21aa", enabled: true }] }
    }
  },
  tags: ["autodocs"],
  render: (args) => {
    /*
     * Local wrapper to manage open/close state so Storybook Docs page renders correctly.
     */
    const Wrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Open Modal
          </button>
          <AccessibleModal isOpen={open} onClose={() => setOpen(false)} titleId="demoTitle" {...args}>
            <p id="demoTitle" className="text-lg font-semibold mb-4">Modal heading</p>
            <p className="mb-4">This is an accessible modal dialog.</p>
            <button className="btn" onClick={() => setOpen(false)}>Close</button>
          </AccessibleModal>
        </>
      );
    };
    return <Wrapper />;
  }
};
export default meta;

type Story = StoryObj<typeof AccessibleModal>;

export const Default: Story = {
  args: {}
};
