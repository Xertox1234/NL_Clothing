# 🧠 agents.md

## 📂 1. Project Structure Overview

This monorepo leverages Turborepo for efficient code sharing and structured modularity.

```
monorepo-root/
├── apps/
│   ├── web/                # React 19 frontend, Tailwind 4, React Server Components
│   └── api/                # Node.js backend with tRPC and PostgreSQL
├── packages/
│   ├── ui/                 # WCAG 2.1-compliant UI components using Tailwind 4
│   ├── hooks/              # Reusable React hooks
│   ├── utils/              # Utility functions
│   └── types/              # Shared TypeScript types
├── codex/                  # AI-specific metadata and files
├── flowcharts/             # Visual flows and interactions
├── wireframes/             # Markdown-based UI wireframes
├── cypress/                # Automated accessibility and integration tests
└── docs/                   # Project documentation
```

**Interactions:**

* `apps/web` uses components from `packages/ui`, utilities from `packages/utils`, hooks from `packages/hooks`, and types from `packages/types`.
* `apps/api` utilizes shared utilities and types for backend consistency.
* Components from `packages/ui` ensure adherence to WCAG 2.1 compliance.
* The `/codex` directory includes metadata and guidance for AI-assisted development.

## 🧠 2. AI Reasoning Rules & Coding Conventions

Codex must adhere strictly to the following rules:

* **Tailwind CSS:** Tailwind 4 is pre-configured, no PostCSS required.
* **File Naming:**

  * `kebab-case` for filenames (e.g., `product-details.tsx`)
  * `PascalCase` for component names (e.g., `ProductDetails`)
* **TypeScript:** Enable strict mode in all project files.
* **React Components:**

  * Functional components preferred; maintain statelessness when feasible.
  * Utilize React Server Components for dynamic, data-heavy pages.
* **Reuse Components:** Prioritize components from `/packages/ui` before introducing new ones.

## 📚 3. Agent Behavior Guidelines

Codex must follow these guidelines:

* **New Code Placement:**

  * Hooks → `/packages/hooks`
  * Utility functions → `/packages/utils`
  * Type definitions → `/packages/types`
* **Logic Reuse:** Verify existing logic before creating new implementations.
* **Accessibility:**

  * Semantic HTML tags
  * Proper use of `aria-*` attributes
  * Keyboard navigation support
* **Code Comments:** Only clarify non-obvious logic using single-line (`//`) or multi-line (`/** ... */`) comments.

## 🧪 4. Testing and Accessibility Expectations

* **Testing Tools:**

  * Cypress integrated with Axe for accessibility testing.
  * @testing-library/react for unit and integration testing.
* **Compliance:** All pages and components must pass WCAG 2.1 AA standards.
* **Accessibility-First Development:** Follow best practices consistently.

## 📄 5. Agent-Compatible Metadata and Files

Within `/codex`:

* `agents.md`: This file outlining AI rules and guidelines.
* `codex-startup.sh`: Shell script to setup dependencies and initialize Codex contexts.
* `memory-notes.md`: Contextual notes for design and conventions.
* `instruction-meta.json`: Machine-readable agent context metadata.

## 🔁 6. Feedback and Logging

* **Development Logging:** Codex suggestions logged at `/logs/codex-suggestions.log` for continuous review.
* **Continuous Feedback:** Review logs frequently to refine AI behavior and prompt effectiveness.
