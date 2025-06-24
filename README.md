# 🚀 Super Duper E‑commerce App

[![Lint & Type-Check](https://github.com/Xertox1234/NL_Clothing/actions/workflows/lint-typecheck.yml/badge.svg)](https://github.com/Xertox1234/NL_Clothing/actions/workflows/lint-typecheck.yml)
[![Unit + Component Tests](https://github.com/Xertox1234/NL_Clothing/actions/workflows/unit-component.yml/badge.svg)](https://github.com/Xertox1234/NL_Clothing/actions/workflows/unit-component.yml)
[![E2E + Accessibility](https://github.com/Xertox1234/NL_Clothing/actions/workflows/e2e-a11y.yml/badge.svg)](https://github.com/Xertox1234/NL_Clothing/actions/workflows/e2e-a11y.yml)
[![Lighthouse A11y 100](https://github.com/Xertox1234/NL_Clothing/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/Xertox1234/NL_Clothing/actions/workflows/lighthouse.yml)
[![Secret Scan](https://github.com/Xertox1234/NL_Clothing/actions/workflows/secret-scan.yml/badge.svg)](https://github.com/Xertox1234/NL_Clothing/actions/workflows/secret-scan.yml)
[![Docker Build + Scan](https://github.com/Xertox1234/NL_Clothing/actions/workflows/docker-deploy.yml/badge.svg)](https://github.com/Xertox1234/NL_Clothing/actions/workflows/docker-deploy.yml)
[![Coverage](https://codecov.io/gh/Xertox1234/NL_Clothing/branch/main/graph/badge.svg)](https://codecov.io/gh/Xertox1234/NL_Clothing)
[![Storybook](https://img.shields.io/badge/Storybook-Browse-blue?logo=storybook)](https://xertox1234.github.io/NL_Clothing/)

> **Tagline:** A WCAG-first, AI-assisted, React 19 + Node/tRPC monorepo for modern accessible online stores.



## ✨ Key Features

* **React 19 + Vite** frontend with **React Server Components** (RSC) for near‑instant content rendering.
* **Node.js (Fastify) API** exposing **tRPC** endpoints with end‑to‑end TypeScript safety.
* **Tailwind 4** design system & shared **ui** package meeting **WCAG 2.1 AA**.
* **NextAuth v5** credentials, magic‑link, MFA (TOTP) flows.
* **PostgreSQL 16** via **Prisma** migrations.
* **Turborepo** monorepo orchestration with remote caching.
* **Cypress + axe‑core** = 100 % automated accessibility coverage.
* **Lighthouse CI**, **Sentry**, strict TypeScript & ESLint gates.
* AI coding‑agent guidance in `/codex` for automated code completion.

---

## 📂 Repository Layout (TL;DR)

See **Project Architecture** table inside [`docs/Project Structure Plan`](../docs/Project%20Structure%20Plan.md).

---

## 🖥️ Requirements

| Tool       | Version |
| ---------- | ------- |
| Node       | 20 LTS  |
| PNPM       | 8.x     |
| PostgreSQL | 16      |
| Git        | 2.40+   |

Optional: **Redis 7** (queue/cache), **Docker** for one‑shot containers.

---

## ⚡ Quick Start (Local)

```bash
# 1. Clone & install deps
pnpm i

# 2. Bootstrap DB (PostgreSQL must be running)
pnpm dlx prisma migrate dev --name init

# 3. Seed sample data
pnpm exec ts-node scripts/seed.ts

# 4. Start all apps (turbo)
pnpm dev    # runs web (vite) & api (ts-node) in parallel

# 5. Open http://localhost:3000
```

> The first run warms the **remote cache** (if enabled) to speed subsequent commands.

---

## 🧑‍💻 Common Scripts

| Script            | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | Run web & api concurrently with watch mode           |
| `pnpm build`      | Type‑check, compile packages, build Vite, bundle API |
| `pnpm lint`       | ESLint + Prettier check                              |
| `pnpm test`       | Vitest unit tests + Cypress component tests          |
| `pnpm e2e`        | Cypress E2E headed run                               |
| `pnpm e2e:ci`     | Cypress run ‑‑browser chrome --record                |
| `pnpm a11y`       | Lighthouse CI + axe smoke suite                      |
| `pnpm db:migrate` | Run Prisma migration in prod                         |

All scripts are defined in the **root** `package.json`; Turbo pipes workspaces.

---

## 🔐 Environment Variables

| Variable                | Scope  | Example                                       |
| ----------------------- | ------ | --------------------------------------------- |
| `APP_DATABASE_URL`      | server | `postgres://user:pass@localhost:5432/sd_ecom` |
| `APP_JWT_SECRET`        | server | `super‑secret‑jwt‑key`                        |
| `NEXT_PUBLIC_SITE_NAME` | client | `SuperDuperShop`                              |
| `APP_SENTRY_DSN`        | both   | *provided by Sentry*                          |

Copy `.env.example` → `.env` and fill values.

---

## 🛠️ Development Flows

### Live Reload & RSC

`apps/web` uses **Vite** RSC plugin; editing server components triggers hot restart without full reload.

### Test‑Driven Feature

1. Write failing **Cypress component** test in `cypress/component/<feature>.cy.tsx`.
2. Add UI in `packages/ui` or feature folder.
3. Ensure `cy.checkA11y()` passes.
4. Commit; ADR auto‑sync hook updates dates.

---

## 🧪 Quality Gates

* **Type Safety:** `tsc --noEmit` in CI.
* **Lint:** ESLint AirBnB + `jsx‑a11y`.
* **Unit:** Vitest must pass.
* **Accessibility:** Cypress + axe no violations.
* **Lighthouse:** Score ≥ 100 in Accessibility.

CI pipeline lives in `.github/workflows/ci.yml` and blocks merge on any failure.

---

## 🚀 Deployment

| Target         | Tool                                                 |
| -------------- | ---------------------------------------------------- |
| **Preview**    | Vercel — automatic PR previews (web) + Railway (api) |
| **Production** | Docker images → AWS ECS Fargate                      |

1. `pnpm build` → generates `apps/web/dist` & `apps/api/dist`.
2. `Dockerfile` multi‑stage emits slim Nginx + Node images.
3. GitHub Actions pushes tags, triggers ECS deploy.

---

## 🤝 Contributing

1. Fork & create a feature branch.
2. Write or update tests to cover changes.
3. Run `pnpm preflight` (runs lint + a11y + unit).
4. Open PR with `feat:` or `fix:` prefix.
5. Label **docs\:memory** if ADR table or memory notes touched.

Code style follows Prettier 3; commit messages follow Conventional Commits.

---

## ♿ Accessibility Commitment

We follow **Rule 0**: no feature is merged if it introduces a WCAG 2.1 AA issue. Automated and manual audits run each sprint; user feedback routes to `#accessibility-feedback` in Slack.

---

## 🔒 Security Guidelines

* Dependabot weekly updates with semantic‑release notes.
* MFA enforced on maintainer GitHub accounts.
* Tokens masked in logs.
* Rate‑limit sign‑in & MFA verification (`express‑rate‑limit`).

---

## 📄 Further Reading

* [`docs/agents.md`](docs/agents.md) – AI agent coding rules.
* [`docs/accessibility.md`](docs/accessibility.md) – Deep a11y guidance.
* [`docs/cypress-tests.md`](docs/cypress-tests.md) – E2E patterns.
* [`docs/memory-notes.md`](docs/memory-notes.md) – Architectural memory.

---

> *Built with ❤️ & accessibility at its core.*













