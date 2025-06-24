// cypress/support/e2e.ts
// --------------------------------------------------
// Global hooks for all E2E specs.
// Ensures every shard (and every spec) starts from a
// pristine DB state by truncating then reseeding.
// --------------------------------------------------

import "cypress-axe";

beforeEach(() => {
  // Guarantee isolation when specs are sharded in CI.
  cy.task("db:truncate").then((ok) => {
    if (!ok) throw new Error("db:truncate task failed");
  });
  cy.task("db:seed").then((ok) => {
    if (!ok) throw new Error("db:seed task failed");
  });
});

// Automatically inject axe on page load for quick a11y checks
Cypress.Commands.add("checkA11yAll", () => {
  cy.injectAxe();
  cy.checkA11y();
});
