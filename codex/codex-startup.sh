#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# codex-startup.sh  |  Monorepo bootstrap for humans + AI agents
# ---------------------------------------------------------------------------
# Tasks performed:
#   1. Validate host tooling (Node 20, PNPM 8, Docker → optional Postgres)
#   2. Install JS dependencies (prefer-offline)
#   3. Run env preflight check (scripts/preflight.ts)
#   4. Provision database (Docker fallback) + Prisma migrate & seed
#   5. Install Husky hooks (story-stub+ADR sync, gitleaks)
#   6. Print Codex hints & credentials summary
# ---------------------------------------------------------------------------
set -euo pipefail
ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

# 1️⃣  Verify Node 20 LTS via fnm if not present
NODE_MAJOR=$(node -v 2>/dev/null | sed -E 's/v([0-9]+).*/\1/') || true
if [[ -z "$NODE_MAJOR" || $NODE_MAJOR -lt 20 ]]; then
  echo "ℹ️  Installing Node 20 via fnm…"
  curl -fsSL https://fnm.vercel.app/install | bash
  export PATH="$HOME/.fnm:$PATH" && eval "$(fnm env --use-on-cd)"
  fnm install 20 && fnm use 20
fi

# 2️⃣  Verify PNPM 8
if ! command -v pnpm >/dev/null 2>&1; then
  echo "🔧 Installing PNPM…"
  corepack enable && corepack prepare pnpm@8 --activate
fi

# 2a️⃣  Install JS dependencies
export PNPM_HOME="${PNPM_HOME:-$HOME/.local/share/pnpm}"
mkdir -p "$PNPM_HOME" && export PATH="$PNPM_HOME:$PATH"

pnpm install --frozen-lockfile --prefer-offline

# 3️⃣  Preflight env var check
echo "🔍 Running env preflight…"
if ! pnpm exec ts-node scripts/preflight.ts; then
  echo "🚫 Preflight failed. Populate .env variables and retry."
  exit 1
fi

# 4️⃣  Ensure Postgres
if [[ -z "${APP_DATABASE_URL:-}" ]]; then
  echo "🐳 Starting temporary Postgres (Docker)…"
  docker run --name sd_pg -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=sd_ecom -p 5432:5432 -d postgres:16-alpine
  export APP_DATABASE_URL="postgres://postgres:secret@localhost:5432/sd_ecom"
  until docker exec sd_pg pg_isready >/dev/null 2>&1; do sleep 1; done
fi

# 4b️⃣  Prisma migrate & seed
pnpm dlx prisma migrate deploy
pnpm exec ts-node prisma/seed.ts

# 5️⃣  Husky hooks (if missing)
if [[ ! -d .husky ]]; then
  echo "🔗 Installing Husky Git hooks…"
  pnpm dlx husky-init && pnpm install
fi

# 6️⃣  Summary banner
cat <<EOF

✅  Bootstrap complete!

• Codex hints → codex/.codex-hints
• Pre-commit hooks: Storybook stub generator + ADR date sync
• Pre-push hook: gitleaks secret scan
• Local Postgres container: sd_pg (password: secret)
• Sample admin → admin@example.com / Pass1234!

Run: pnpm dev   # start web + api watchers
EOF
