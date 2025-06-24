name: e2e-a11y

on:
  pull_request:
  push:
    branches: [main]

jobs:
  e2e-a11y:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3]  # spin up 3 parallel runners

    steps:
      - name: ⬇️ Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🟢 Setup Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: 🔧 Setup PNPM 8
        uses: pnpm/action-setup@v3
        with:
          version: 8
          run_install: false

      - name: 📦 Install dependencies (pnpm i)
        run: pnpm install --frozen-lockfile --prefer-offline

      - name: 🛠  Bootstrap stack (codex-startup)
        run: bash codex/codex-startup.sh

      - name: 🚀 Start dev servers (web + api)
        run: |
          pnpm dev &
          npx wait-on http://localhost:3000

      - name: 🕷️ Cypress E2E + axe-core (parallel shard ${{ matrix.shard }})
        uses: cypress-io/github-action@v5
        with:
          browser: chrome
          record: true
          parallel: true
          group: e2e-a11y
          tag: ${{ github.sha }}
          command: pnpm exec cypress run --record --parallel
          wait-on: 'http://localhost:3000'
          wait-on-timeout: 180
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}

      - name: 🏷️ Upload Cypress artefacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-a11y-results-${{ matrix.shard }}
          path: |
            cypress/results
            cypress/screenshots
            cypress/videos
