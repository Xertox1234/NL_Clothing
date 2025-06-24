/**
 * Type declarations for testing libraries
 * This file ensures TypeScript recognizes testing-library matchers and Jest globals
 */

import '@testing-library/jest-dom';

// Augment the Jest matcher types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number | null): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAccessibleName(name: string): R;
      toHaveAccessibleDescription(desc: string): R;
    }
  }
}

// For jest-axe
declare module 'jest-axe' {
  interface AxeResults {
    passes: Array<any>;
    violations: Array<any>;
    incomplete: Array<any>;
    inapplicable: Array<any>;
  }
  
  interface JestAxeConfig {
    rules?: Record<string, { enabled: boolean }>;
    context?: any;
    impact?: 'minor' | 'moderate' | 'serious' | 'critical';
  }
  
  function axe(html: Element | string, options?: JestAxeConfig): Promise<AxeResults>;
  
  namespace axe {
    const toHaveNoViolations: jest.Matchers<any>;
  }
  
  export = axe;
}
