// Jest setup file for UI components
import '@testing-library/jest-dom';

// Import jest-axe for accessibility testing
import { toHaveNoViolations } from 'jest-axe';

// Add custom matchers from jest-axe
expect.extend(toHaveNoViolations);
