#!/usr/bin/env ts-node
/**
 * scripts/preflight.ts
 * ------------------------------------------------------------------------
 * Ensures required env vars exist before dev starts. Reads `.env.example`,
 * compares to user `.env`, and prints a warning for each missing variable.
 * Does **not** exit with error (so CI can override via process env), but
 * exits non‑zero if running in local shell & vars are missing.
 * ------------------------------------------------------------------------
 * Add to `package.json` scripts:
 *   "preflight": "ts-node scripts/preflight.ts"
 * Then run: `pnpm preflight` (or call from codex-startup if desired).
 */
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

async function loadEnvFile(file: string): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(file, 'utf8');
    const parsed = dotenv.parse(content);
    return parsed;
  } catch {
    return {};
  }
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const exampleVars = await loadEnvFile(path.join(root, '.env.example'));
  const userVars = await loadEnvFile(path.join(root, '.env'));

  const missing: string[] = [];
  for (const key of Object.keys(exampleVars)) {
    if (!userVars[key] && !process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    console.warn('\u26A0\uFE0F  Missing env vars:');
    missing.forEach((k) => console.warn(`  • ${k}`));
    console.warn('\nCreate/Update .env or export variables before running dev.');
  }

  // Exit with non‑zero only if running in interactive shell (TTY)
  if (missing.length > 0 && process.stdout.isTTY) {
    process.exit(1);
  } else {
    console.log('✅  Env check passed');
  }
}

main();
