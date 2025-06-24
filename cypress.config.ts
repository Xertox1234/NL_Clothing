import { defineConfig } from "cypress";
import path from "path";

/**
 * Cypress root configuration with custom tasks.
 * - Registers `db:seed` task to reset DB via ts-node without UI.
 * - Injects axe for every spec via support/e2e.ts.
 */
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    experimentalRunAllSpecs: true,
    video: true,
    setupNodeEvents(on, config) {
      // Register gitleaks plugin if needed and other plugins already defined elsewhere.
      require("cypress-axe/plugin")(on);

      // 👉 Custom task: db:seed
      on("task", {
        /**
         * Reset database by running Prisma seed through ts-node.
         * Usage in test: `cy.task('db:seed')`.
         */
        async "db:seed"() {
          const { execSync } = await import("child_process");
          const root = path.resolve(__dirname);
          try {
            execSync("pnpm exec ts-node prisma/seed.ts", { stdio: "inherit", cwd: root });
            return true;
          } catch (e) {
            console.error("db:seed task failed", e);
            return false;
          }
        }
      });

      return config;
    }
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite"
    }
  }
});
