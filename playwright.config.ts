import { defineConfig } from "@playwright/test";

/**
 * Config dos testes da demo.
 *
 * Regista dois reporters:
 *  - 'list': o output normal no terminal / nos logs do CI.
 *  - o reporter do Self-Healer: no fim da run, junta os contextos capturados
 *    pela fixture e faz POST para o backend (SELFHEALER_ENDPOINT) com a chave
 *    SELFHEALER_API_KEY. Em CI, repo/sha/branch são lidos das env vars do
 *    GitHub Actions automaticamente.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 15_000,
  reporter: [
    ["list"],
    ["@selfhealer/playwright/reporter"],
  ],
  use: {
    headless: true,
  },
});
