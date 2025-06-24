# 🧪 cypress-tests.md

## 🎯 Purpose

This document defines a **comprehensive Cypress test architecture** that delivers near‑100 % functional + accessibility test coverage for every app surface (RSC pages, auth flows, modals, toasts, cart, checkout, API error states). It is intended for **AI coding agents** and includes boilerplate code, naming conventions, CI integration, and troubleshooting notes.

> **Accessibility First:** Every test spec must inject **axe‑core** via `cy.injectAxe()` and perform at minimum one `cy.checkA11y()` assertion per rendered state.

---

## 📂 Directory Layout

```
/cypress
  ├── e2e/               # Full‑page tests
  │   ├── auth/          # sign‑in, magic link, MFA, reset flows
  │   ├── cart/          # add‑to‑cart, persistent cart
  │   └── ui‑patterns/   # modals, alerts, skip‑links
  ├── component/         # Cypress Component Testing (React 19)
  ├── fixtures/          # JSON fixture data, mock API payloads
  ├── support/
  │   ├── commands.ts    # Custom commands (axe, realPress, auth helpers)
  │   └── e2e.ts         # Global hooks (viewport, injectAxe)
  └── plugins.ts         # cypress‑axe + reporters registration
```

---

## 🛠️ Core Dependencies

| Package                    | Purpose                                                                                                                                                                                                                                                                                                       | Notes                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cypress` ^15              | E2E & component runner                                                                                                                                                                                                                                                                                        | React 19 support via CT runner([timdeschryver.dev](https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility?utm_source=chatgpt.com)) |
| `cypress-axe`              | a11y assertions (`cy.injectAxe`, `cy.checkA11y`)([github.com](https://github.com/component-driven/cypress-axe?utm_source=chatgpt.com), [npmjs.com](https://www.npmjs.com/package/cypress-axe?utm_source=chatgpt.com))                                                                                         |                                                                                                                                                          |
| `axe-core`                 | Underlying WCAG audit engine                                                                                                                                                                                                                                                                                  |                                                                                                                                                          |
| `cypress-real-events`      | Native keyboard / pointer simulation for focus walks([github.com](https://github.com/dmtrKovalenko/cypress-real-events?utm_source=chatgpt.com), [stackoverflow.com](https://stackoverflow.com/questions/76172139/keyboard-navigation-is-not-working-with-realpress-method-in-cypress?utm_source=chatgpt.com)) |                                                                                                                                                          |
| `@testing-library/cypress` | DOM queries aligned with RTL                                                                                                                                                                                                                                                                                  |                                                                                                                                                          |
| `cypress-junit-reporter`   | JUnit XML output for CI pipelines([npmjs.com](https://www.npmjs.com/package/cypress-junit-reporter?utm_source=chatgpt.com))                                                                                                                                                                                   |                                                                                                                                                          |
| `mochawesome`              | HTML + JSON reports                                                                                                                                                                                                                                                                                           |                                                                                                                                                          |

---

## ⚙️ Configuration (cypress.config.ts)

```ts
import { defineConfig } from 'cypress';
import cypressWatchAndReload from 'cypress-watch-and-reload/plugin';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    video: true,
    screenshotsFolder: 'cypress/artifacts/screens',
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      require('cypress-axe/plugin')(on);
      cypressWatchAndReload(on, config);
      return config;
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome, cypress-junit-reporter',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/artifacts/mocha',
      embeddedScreenshots: true
    }
  }
});
```

### Accessibility Ruleset Override

```ts
Cypress.Commands.add('checkA11yPage', () => {
  cy.injectAxe();
  cy.checkA11y(undefined, {
    runOnly: ['wcag2a', 'wcag2aa']
  });
});
```

---

## 🔌 Custom Commands (support/commands.ts)

```ts
import 'cypress-axe';
import 'cypress-real-events/support';

Cypress.Commands.add('loginUI', (email, password) => {
  cy.visit('/auth/sign-in');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.realPress('Enter');
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginUI(email: string, password: string): Chainable<void>;
    }
  }
}
```

---

## 🧑‍💻 Test Patterns

### 1. Authentication (Credentials, Magic‑Link, MFA)

* Use fixture users with deterministic passwords.
* Magic‑link token retrieval via database hook to bypass email pipeline (speed).([next-auth.js.org](https://next-auth.js.org/tutorials/testing-with-cypress?utm_source=chatgpt.com), [github.com](https://github.com/nextauthjs/next-auth/discussions/2053?utm_source=chatgpt.com))
* MFA flow seeds TOTP secret, then calculates current code with `otplib`. Assert focus lands on first digit input.

### 2. Modals & Dialogs

* Assert **focus trap** by sending `cy.realPress('Tab')` repeatedly until looped back to close button.
* Axe rule `aria-modal` + `dialog-name` should be zero violations.

### 3. Alerts & Toasts

* Trigger toast provider (`cy.window().then(win => win.showToast('Saved!'))`) and ensure `role="status"` container present.
* Form error: Simulate submit, check first invalid input focused and corresponding `role="alert"` text announced.

### 4. Skip‑Links & Keyboard Nav

* `cy.realPress('Tab')` until *Skip to main* appears, press **Enter**, assert URL hash `#main`.
* Walk 20 sequential **Tab** keystrokes and ensure no focus escapes invisible elements.([docs.cypress.io](https://docs.cypress.io/app/guides/accessibility-testing?utm_source=chatgpt.com))

### 5. Network Resilience

* Intercept critical API calls with `cy.intercept` and stub `503` to verify error banner shows.([docs.cypress.io](https://docs.cypress.io/api/commands/intercept?utm_source=chatgpt.com), [learn.cypress.io](https://learn.cypress.io/advanced-cypress-concepts/intercepting-network-requests?utm_source=chatgpt.com))

### 6. Accessibility Audits

* Every spec: call `cy.checkA11yPage()` after each interaction snapshot (open modal, after toast, after route change).
* Project uses **axe‑core v4.10** (WCAG 2.1) – update monthly.

---

## 📊 Coverage & Flake Mitigation

| Strategy             | Implementation                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spec‑Parallel**    | GitHub Actions matrix with `cypress-io/github-action@v5` parallel shards; auto‑balances test files via `record` flag and Dashboard.([docs.cypress.io](https://docs.cypress.io/app/continuous-integration/github-actions?utm_source=chatgpt.com), [github.com](https://github.com/marketplace/actions/cypress-parallel?utm_source=chatgpt.com)) |
| **Retries**          | `retries: { runMode: 2, openMode: 0 }` in config – surfaces flaky tests locally                                                                                                                                                                                                                                                                |
| **Network Timeouts** | Global `defaultCommandTimeout` = 6000; intercepts stubbed                                                                                                                                                                                                                                                                                      |
| **Code Coverage**    | `@cypress/code-coverage` plugin provides Istanbul reports merged in CI.([browserstack.com](https://www.browserstack.com/guide/cypress-accessibility-testing?utm_source=chatgpt.com))                                                                                                                                                           |

---

## 🏗️ Continuous Integration (GitHub Actions)

```yaml
name: e2e-test
on:
  pull_request:
  push:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 8 }
      - run: pnpm install --frozen-lockfile --filter "...apps/**"
      - run: pnpm turbo run build --filter "apps/*"
      - uses: cypress-io/github-action@v5
        with:
          record: true
          parallel: true
          group: shard-${{ matrix.shard }}
```

* **JUnit** + **Mochawesome** artefacts uploaded for QA triage.([docs.cypress.io](https://docs.cypress.io/app/tooling/reporters?utm_source=chatgpt.com))
* Dashboard trends flake rates; any spec with flake > 2 % triggers alert.

---

## 🧩 Troubleshooting Matrix

| Symptom                                     | Likely Cause                            | Fix                                                                                                                                                                 |
| ------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TypeError: cy.injectAxe is not a function` | Plugin not imported in `support/e2e.ts` | `import 'cypress-axe'` after Cypress load([timdeschryver.dev](https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility?utm_source=chatgpt.com)) |
| Real key events ignored in CI               | CI host lacks virtual display           | Use `xvfb-run --auto-servernum` wrapper                                                                                                                             |
| Flaky network tests                         | Server responds 429/503                 | Stub via `cy.intercept` + static fixtures                                                                                                                           |

---

## ✅ Review Gates

1. **Lint:** ESLint, Prettier.
2. **Unit:** Vitest + RTL.
3. **Component CT:** Cypress component.
4. **E2E:** Must finish with zero axe violations, zero failed specs.
5. **Lighthouse CI:** Accessibility ≥ **100**.

Any regression fails the PR.

---

## 🔄 Continuous Improvement

* **Monthly**: bump `cypress` & `cypress-axe`, run full WCAG regression.
* **Quarterly**: rotate real‑device BrowserStack run for cross‑platform keyboard nav.
* **Alert backlog**: auto‑generate axe‑violation CSV via `cy.task('a11yReport')` for design remediation.
