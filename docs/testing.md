# 📝 Testing Documentation

## 🎯 Overview

This document outlines the testing approach for the Next Level Clothing project, including unit, integration, and end-to-end testing strategies. All tests follow the project's architectural principles, with a strong focus on accessibility compliance and TypeScript type safety.

## 🏗️ Testing Architecture

### Directory Structure

Tests are organized according to the project's monorepo structure:

- **Unit Tests**: Located in `__tests__` folders within each package
  - UI components: `packages/ui/src/__tests__/`
  - Hooks: `packages/hooks/src/__tests__/`
  - tRPC Client: `packages/trpc-client/src/__tests__/`
  
- **End-to-End Tests**: Located in the web application's Cypress directory
  - E2E flow tests: `apps/web/cypress/e2e/`
  - Component tests: `apps/web/cypress/component/`

### Test Files Naming Convention

```
[ComponentName].test.tsx  // For React component tests 
[utilityName].test.ts     // For utility/function tests
[flowName].cy.ts          // For Cypress E2E tests
```

## 🧪 Testing Tools

### Unit and Integration Testing

- **Jest**: Main test runner for all JavaScript/TypeScript tests
- **React Testing Library**: Testing React components with focus on user behavior
- **jest-axe**: Accessibility testing for components
- **ts-jest**: TypeScript support for Jest

### End-to-End Testing

- **Cypress**: Main E2E testing framework
- **Cypress-axe**: Accessibility testing within E2E flows
- **Cypress-audit**: Lighthouse and Pa11y integration for performance and accessibility

## 📚 Test Types

### Component Tests

Component tests focus on isolated testing of UI components:

```tsx
// Example from Navbar.test.tsx
it('should render navigation links correctly', () => {
  const { getByText } = render(<Navbar />);
  expect(getByText('Home')).toBeInTheDocument();
  expect(getByText('Products')).toBeInTheDocument();
  expect(getByText('About')).toBeInTheDocument();
});

it('should pass accessibility checks', async () => {
  const { container } = render(<Navbar />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Hook Tests

Custom React hooks are tested with renderHook:

```tsx
// Example from useCart.test.tsx
it('should add item to cart', () => {
  const { result } = renderHook(() => useCart());
  act(() => {
    result.current.addItem({ id: '1', name: 'Test Product', price: 10 });
  });
  expect(result.current.items).toHaveLength(1);
});
```

### API Client Tests

The tRPC client is tested with mocks to simulate API communication:

```typescript
// Example from client.test.ts
it('should add authorization header when token exists', () => {
  mockLocalStorage.getItem.mockReturnValueOnce('test-jwt-token');
  createTrpcClient('http://localhost:3001/trpc');
  
  const headersFn = httpBatchLink.mock.calls[0][0].headers;
  const headers = headersFn();
  
  expect(headers).toEqual(expect.objectContaining({
    authorization: 'Bearer test-jwt-token',
  }));
});
```

### End-to-End Tests

E2E tests simulate real user flows:

```typescript
// Example from checkout-flow.cy.ts
it('should complete checkout process', () => {
  cy.setupCart();
  cy.visit('/cart');
  cy.findByText('Proceed to Checkout').click();
  
  // Fill shipping info
  cy.get('[data-testid="shipping-form"]').within(() => {
    cy.findByLabelText('Full Name').type('John Doe');
    cy.findByLabelText('Address').type('123 Main St');
    cy.findByText('Continue').click();
  });
  
  // Complete payment and verify order summary
  cy.get('[data-testid="payment-form"]').within(() => {
    cy.findByLabelText('Card Number').type('4242424242424242');
    cy.findByLabelText('Expiration').type('12/25');
    cy.findByText('Complete Order').click();
  });
  
  cy.findByText('Order Complete').should('be.visible');
  
  // Verify accessibility
  cy.injectAxe();
  cy.checkA11y();
});
```

## ⚙️ Configuration

### Jest Configuration

Each package that requires testing includes a `jest.config.js` file:

```javascript
// Base Jest configuration pattern used in packages
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Cypress Configuration 

Cypress configuration includes TypeScript support and accessibility plugins:

```javascript
// cypress.config.ts
import { defineConfig } from 'cypress';
import axe from 'cypress-axe';
import audit from 'cypress-audit';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      axe(on, config);
      audit(on, config);
    },
  }
});
```

## 🛠️ TypeScript Integration

All tests leverage TypeScript for type safety:

- Test files use `.tsx` or `.ts` extensions
- Type references for testing libraries are included in tsconfig.json files
- Where needed, `@ts-ignore` or `@ts-nocheck` directives are used pragmatically

## 🚀 Test Scripts

Execute tests using the following commands:

```bash
# Run all tests in the monorepo
pnpm test

# Run tests for a specific package
pnpm --filter @next-level-clothing/ui test

# Run end-to-end tests
pnpm --filter web cypress:run
```

## 🔄 CI/CD Integration

Tests are automatically run in CI pipeline:
- Unit and integration tests run on every pull request
- End-to-end tests run on selected branches
- Lighthouse tests run on production deployments

## 🚨 Common Issues & Fixes

### TypeScript Configuration

When setting up tests for TypeScript projects, ensure:

1. Proper `tsconfig.json` alignment
2. Types referenced in the project and test files
3. Use `@ts-nocheck` sparingly for complex test mocks

### Accessibility Testing 

- Use both unit-level testing with jest-axe and E2E testing with cypress-axe
- Include all interactive tests with keyboard navigation checks
- Test contrast ratios and screen reader compatibility

### Working with Monorepo

- Use `pnpm` for all package operations
- Ensure workspace references are properly linked
- Fix dependency issues by managing versions in root package.json

## 🔍 Code Coverage

Jest is configured to collect code coverage metrics. Aim for minimum coverage:

- Statements: 80%
- Branches: 80% 
- Functions: 80%
- Lines: 80%

## 🔄 Continuous Improvement

The testing strategy will evolve with the project. Current focus areas:

1. Expanding component test coverage
2. Adding more E2E tests for critical user flows
3. Implementing visual regression testing
4. Further automating accessibility tests
