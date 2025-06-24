module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss|less)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    // Transform files with ts-jest
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
