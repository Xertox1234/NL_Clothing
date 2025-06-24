/**
 * Storybook global setup
 * ----------------------
 * • Imports the project-wide Tailwind/Global styles so components render correctly.
 * • Registers the a11y addon decorator to run axe on each story.
 * • Sets default parameters for actions & controls.
 */

import "../../web/src/global.css"; // adjust path if your global styles differ
import { withA11y } from "@storybook/addon-a11y";
import type { Preview } from "@storybook/react";

export const decorators = [withA11y];

export const parameters: Preview["parameters"] = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  a11y: {
    // Fail the story if any WCAG 2.1 AA violation is detected.
    // Mirrors Rule 0 from the repo docs.
    config: {
      rules: [
        {
          id: "wcag21aa",
          enabled: true
        }
      ]
    },
    // Show the preview panel by default.
    manual: false
  }
};

const preview: Preview = { parameters, decorators };
export default preview;
