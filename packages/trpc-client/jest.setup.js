// Import jest-dom for DOM testing assertions
require('@testing-library/jest-dom');

// Import axe-core for accessibility testing
require('jest-axe/extend-expect');

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Add any global test utilities here
global.testUtils = {
  // Helper to wait for async operations
  flushPromises: () => new Promise(resolve => setTimeout(resolve, 0)),
};

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*cannot update a component/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
