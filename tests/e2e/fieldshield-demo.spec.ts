import { expect, test } from "@playwright/test";

test("runs the embedded FieldShield demonstration without a live API", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /run fieldshield demo/i }).click();

  await expect(page.getByRole("heading", { name: /genesis found the product beneath the request/i })).toBeVisible();
  await expect(page.getByText(/640 questionnaire responses/i)).toBeVisible();
  await page.getByRole("button", { name: /shape the fieldshield blueprint/i }).click();

  await expect(page.getByText("FieldShield", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /seven-document build pack/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /field operations dashboard/i })).toBeVisible();

  await page.getByRole("button", { name: /review Akinyele fieldwork/i }).click();
  await expect(page.getByText(/54 responses remaining/i)).toBeVisible();
  await page.getByRole("button", { name: /activate handover mode/i }).click();
  await expect(page.getByRole("status")).toContainText(/handover mode is active/i);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
