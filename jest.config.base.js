/**
 * Base Jest configuration for Next Level Clothing monorepo
 * All packages should extend this configuration
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Transform configuration for TypeScript files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [],
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  }
};
