# 🧠 memory-notes.md

> **Audience:** AI coding agents (OpenAI Codex, GPT‑4o) operating within this monorepo. These notes store **long‑lived context**—architecture decisions, naming rules, and edge‑case knowledge.
>
> **Mutation‑Policy v3**  
> • Update only via PRs labelled `docs:memory` **and** include rationale in the commit body.  
> • Git **pre‑commit hook** auto‑runs Storybook stub generator _and_ ADR date sync.  
> • Git **pre‑push hook** blocks secrets via **gitleaks**.  
> • CI mirrors these hooks—see §11.

---

## 1  Global Principles

1. **Accessibility > All** — Any WCAG 2.1 AA regression blocks merge (**Rule 0**).  
2. **Source of Truth** — Prisma schema + shared `@types` drive contracts.  
3. **Convention > Configuration** — Predictable paths, **kebab‑case** filenames, strict TS.  
4. **Zero Runtime CSS** — Tailwind 4 JIT; PostCSS config **forbidden**.  
5. **React 19 First** — Avoid deps with deprecated lifecycles.  
6. **Stateless by Default** — Prefer RSC; lift client state only when required.

---

## 2  Folder & Naming Rules

| Scope | Pattern | Example |
|-------|---------|---------|
| **Apps** | `/apps/<target>` | `apps/web` |
| **Packages** | `/packages/<domain>` | `packages/ui` |
| **Components** | `PascalCase.tsx` | `ProductCard.tsx` |
| **Hooks** | `useX.ts` | `useFocusTrap.ts` |
| **Utils** | `verb-noun.ts` | `format-currency.ts` |
| **DB tables** | snake_case plural | `order_items` |
| **Env vars** | `NEXT_PUBLIC_*`, `APP_*` | `APP_JWT_SECRET` |
| **Stories** | `*.stories.tsx` next to component | `Button.stories.tsx` |

---

## 3  Architectural Decisions Record (ADR)

| ID | Decision | Date | Notes |
|----|----------|------|-------|
| ADR‑001 | Monorepo via Turborepo | 2025‑06‑08 | Cache‑aware CI graph |
| ADR‑002 | React 19 + Vite RSC | 2025‑06‑08 | Fast HMR & RSC |
| ADR‑003 | Tailwind 4 (no PostCSS) | 2025‑06‑08 | Build‑time trim |
| ADR‑004 | NextAuth (Creds + Magic‑Link + MFA) | 2025‑06‑09 | Cookie sessions |
| ADR‑005 | Cypress + axe mandatory | 2025‑06‑09 | Unified E2E+a11y |
| ADR‑006 | tRPC + Zod API | 2025‑06‑09 | End‑to‑end TS safety |

---

## 4  React 19 Compatibility Watch‑List

✅ `react-hook-form@^8` ⚠️ `formik` (legacy) ❌ `react-router-dom@6.22` (no RSC)

_Update monthly._

---

## 5  Data Flow & DB

* PostgreSQL 16 (snake_case).  
* Migrations in `/prisma/migrations`; never edit generated SQL.  
* tRPC routers in `apps/api/src/routers`, schemas in `/packages/types`.

---

## 6  Accessibility Golden Paths

Modal → `AccessibleModal`, Toast → `Alert`+`ToastProvider`, Skip‑Link after `<body>`.

---

## 7  AI Memory Tips

* **Reuse before create**—search packages.  
* **Cite ADR IDs** in code comments.  
* **Read Cypress specs** for edge‑cases.  
* **Consult `.codex-hints`** template tokens.

---

## 8  Known Pitfalls & Fixes

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Dialog remains mounted | Axe `aria-hidden-focus` fail | Unmount on close |
| Toast steals focus | SR jumps | Don’t programmatically focus toast |
| Tailwind purge miss | Style absent | Use literal class strings |
| Token leak | Auth token in logs | Mask in logger middleware |

---

## 9  Glossary

ADR, RSC, TOTP, POUR, Rule 0.

---

## 10  Wishlist

WebAuthn provider, offline cart SW, Sentry source‑maps, high‑contrast theme.

---

## 11  Hook Maintenance

### 11.1  Pre‑commit — Story Stub + ADR Sync

```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

# 1. Ensure every UI component has a Storybook stub.
pnpm exec ts-node scripts/generate-story-exports.ts || exit 1

# 2. Sync ADR dates if memory-notes changed.
changed=$(git diff --cached --name-only | grep 'docs/memory-notes.md')
if [ -n "$changed" ]; then
  today=$(date +%Y-%m-%d)
  sed -E -i "s/(\| ADR-[0-9]{3} \|[^|]*\|) [0-9]{4}-[0-9]{2}-[0-9]{2} \|/\1 $today |/g" docs/memory-notes.md
  git add docs/memory-notes.md
fi
```

### 11.2  Pre‑push — Secret Scanner (gitleaks)

```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
command -v gitleaks >/dev/null 2>&1 || pnpm dlx gitleaks@latest install

echo "🔒 Running gitleaks…"
if ! gitleaks detect --source . --no-banner --redact; then
  echo "🚫 Secrets detected — push blocked."
  exit 1
fi
```

### 11.3  CI — Secret Scan Job

```yaml
secret-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with: { fetch-depth: 0 }
    - uses: gitleaks/gitleaks-action@v2
      with: { fail: true, redact: true }
```

*Hooks use POSIX sh; Windows devs should run Git Bash or WSL.*
