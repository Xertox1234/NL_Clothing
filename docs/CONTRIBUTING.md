# 🤝 Contributing Guide

Welcome to **Super Duper E‑Commerce App!** This document codifies our branch workflow, PR checklist, and—most importantly—our **Rule 0** accessibility standard. Readers are assumed to be either human developers or AI coding agents consuming the repo programmatically.

---

## 1️⃣ Branch Strategy

| Type              | Prefix  | Example                   |
| ----------------- | ------- | ------------------------- |
| **Feature**       | `feat/` | `feat/cart-persistance`   |
| **Fix**           | `fix/`  | `fix/modal-focus-loss`    |
| **Documentation** | `docs/` | `docs/memory-adr007`      |
| **Chore/CI**      | `ci/`   | `ci/github-actions-cache` |

*Branch from `main` only.* Rebase often; avoid merge commits in PRs.

---

## 2️⃣ Commit Message Convention (Conventional Commits)

```
<type>(scope?): <subject>

<body>
```

*Types:* `feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `chore`.

Examples:

```
feat(cart): add persistent cart via indexedDB
fix(modal): restore focus to trigger on close
```

> **docs\:memory** — commits that touch `docs/memory-notes.md` **must** use this label so the ADR auto‑sync hook runs.

---

## 3️⃣ Pull‑Request Checklist ✅

1. **Description** (what & why)
2. **Linked Issue / ADR** (if applicable)
3. **Screenshots / GIF** for UI changes
4. **Tests added / updated** (Vitest, Cypress, axe)
5. **Rule 0:** `pnpm e2e` → zero axe violations (WCAG 2.1 AA)
6. **Lint + Type‑check pass** (`pnpm lint`, `tsc --noEmit`)
7. **No secrets leaked** (`gitleaks detect`)
8. **Docs updated** (`README`, ADRs, flowcharts) if behaviour changes
9. **Label** set (`feat`, `fix`, `docs`, etc.)

A PR that fails any CI gate **cannot** be merged.

---

## 4️⃣ Rule 0 – Accessibility Cannot Regress ♿️

* All pages/components must meet **WCAG 2.1 AA**.
* **Cypress + axe-core** runs on every PR; zero violations required.
* Lighthouse‑CI Accessibility score must remain **100**.
* Manual keyboard nav spot‑checks for complex interactions (modals, drag‑drop).

---

## 5️⃣ Local Dev Commands 🛠

| Task                         | Command                               |
| ---------------------------- | ------------------------------------- |
| Start dev stack              | `pnpm dev`                            |
| Run lint & type‑check        | `pnpm lint && pnpm exec tsc --noEmit` |
| Unit tests (Vitest)          | `pnpm test`                           |
| Component tests (Cypress CT) | `pnpm exec cypress run-ct`            |
| End‑to‑end a11y tests        | `pnpm e2e`                            |

Run `bash codex/codex-startup.sh` first time to bootstrap DB + hooks.

---

## 6️⃣ Code Review Guidelines 🔍

Reviewers look for:

* Clear naming & minimal duplication (reuse packages).
* Tests that cover edge cases.
* No accessibility regressions (focus traps, aria labels).
* Performance considerations (RSC, memoization).
* Security: parameterized queries, secret masking.

---

## 7️⃣ After Merge 🚀

* `main` branch triggers CI + preview deploy.
* Flowchart SVGs auto‑update via Mermaid CLI.
* Sentry source‑maps upload (future).
* Slack `#deployments` notifies success/failure.

---

> **Thank you** for helping build an accessible, performant, and secure store!
