## 📁 Project Architecture

```
monorepo-root/
├── apps/
│   ├── web/                # React 19 frontend using Vite
│   └── api/                # Node.js backend with tRPC
├── packages/
│   ├── ui/                 # Shared WCAG 2.1-compliant components (Tailwind 4)
│   ├── hooks/              # React hooks
│   ├── utils/              # Utility functions
│   └── types/              # Type definitions
├── codex/
│   ├── instruction-meta.json
│   ├── codex-startup.sh
│   └── .codex-hints
├── flowcharts/
│   └── *.svg / *.png
├── wireframes/
│   └── *.md
├── cypress/
│   ├── integration/
│   └── accessibility-tests/
└── docs/
    ├── README.md
    ├── agents.md
    ├── accessibility.md
    ├── cypress-tests.md
    └── memory-notes.md
```

## 📄 Documentation Requirements

### README.md

* High-level project overview
* Setup instructions
* Scripts for running, testing, and deploying

### agents.md

* Detailed monorepo overview
* Rules for agent-guided code completion
* File-specific logic and naming conventions

### codex-startup.sh

* Shell script to install dependencies, configure environments, and initialize Codex context

### accessibility.md

* WCAG 2.1 AA compliance guidelines
* Component-level accessibility instructions and best practices
* Testing methodologies using Cypress + Axe

### cypress-tests.md

* Detailed Cypress test plans
* Accessibility verification processes and Axe integration

### memory-notes.md

* Document architectural decisions
* Naming conventions for components and APIs
* Notes tailored for AI agent context retrieval

### flowcharts

* Visual representations of user journeys, component interactions, and API flows

### wireframes

* Markdown-based wireframes documenting critical views such as home, product, cart, and checkout

## 🧠 AI Agent-Specific Enhancements

* Place Codex-specific files clearly in `/codex` directory.
* Include machine-readable JSON (`instruction-meta.json`) for agent-driven context.
* Provide hooks for optional logging of AI code suggestions.

## 🔁 Collaboration and Feature Ideation

* Regularly clarify evolving project goals and scope
* Proactively suggest features (e.g., smart search with predictive results, real-time live chat support, persistent shopping carts across sessions)
* Monitor and flag performance bottlenecks, accessibility barriers, and security vulnerabilities
* Propose enhancements for developer productivity (CI/CD pipelines, automation tools, code review integrations)

## 📌 Technical Constraints

* Prioritize detailed, rich, and explicit documentation for intelligent AI agents.
* Ensure complete WCAG 2.1 compliance verified via Cypress.
* Frontend built with Tailwind 4 and React Server Components via Vite.
* Backend type safety and development speed prioritized with tRPC.
* Incorporate Lighthouse CI, Sentry error tracking, and enforce TypeScript strict mode across all codebases.

## 🔒 Security and Performance Improvement Suggestion

* **Performance Enhancement:** Implement incremental static regeneration (ISR) or React Server Components to minimize initial load time for content-heavy product pages, significantly improving the end-user experience.
