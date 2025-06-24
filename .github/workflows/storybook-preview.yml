name: storybook-preview

on:
  pull_request:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/ui/**'
      - '.storybook/**'
      - '.github/workflows/storybook-preview.yml'
  workflow_dispatch:

jobs:
  build-and-preview:
    runs-on: ubuntu-latest
    steps:
      - name: ⬇️ Checkout repository
        uses: actions/checkout@v4

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

      - name: 📦 Install dependencies
        run: pnpm install --frozen-lockfile --prefer-offline

      - name: 📚 Build Storybook static site
        run: pnpm exec turbo run build-storybook --filter=apps/storybook

      - name: 📤 Upload Storybook artifact
        uses: actions/upload-artifact@v4
        with:
          name: storybook-static
          path: apps/storybook/storybook-static

      # Optional: Deploy to GitHub Pages
      - name: 🚀 Deploy Storybook to GitHub Pages
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: apps/storybook/storybook-static
          publish_branch: gh-pages
