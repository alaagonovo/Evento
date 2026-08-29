import { expect, test } from "@playwright/test";

test("homepage renders the Evento brand in Arabic", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("link", { name: "Evento" }).first()).toBeVisible();
});
