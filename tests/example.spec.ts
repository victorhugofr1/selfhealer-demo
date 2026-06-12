// Importamos o test/expect do NOSSO package (a fixture do Self-Healer), não do
// @playwright/test directamente. É a fixture que, quando o teste falha por causa
// de um seletor, captura o DOM + o seletor partido para o backend corrigir.
import { test, expect } from "@selfhealer/playwright";

test("login mostra o botão", async ({ page }) => {
  // DOM determinístico: o botão que o teste "quer" existe, mas com data-testid,
  // não com o id antigo. (Em vez de ir a um site real, montamos o HTML aqui
  // para a demo ser sempre igual.)
  await page.setContent('<button data-testid="login">Login</button>');

  // Seletor partido DE PROPÓSITO: "#submit-btn" não existe nesta página, por
  // isso o click dá timeout. A fixture deteta que é falha de seletor e captura
  // o contexto. É isto que dispara o Self-Healer.
  await page.click("[data-testid='login']", { timeout: 5_000 });

  await expect(page.locator("#submit-btn")).toBeVisible();
});
