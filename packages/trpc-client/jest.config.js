/**
 * Jest configuration for trpc-client package
 * Extends from the base configuration
 */
const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: ['./jest.setup.js'],
  displayName: 'trpc-client',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
  // Override coverage thresholds to align with team standards
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Custom transform to handle TypeScript with the package's tsconfig
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.json',
    }],
  },
};
