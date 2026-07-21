import { expect, test } from "@playwright/test";

test("runs the embedded FieldShield demonstration without a live API", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /run fieldshield demo/i }).click();

  await expect(page.getByRole("heading", { name: /genesis found the product beneath the request/i })).toBeVisible();
  await expect(page.getByText(/640 questionnaire responses/i)).toBeVisible();
  await page.getByRole("button", { name: /shape the fieldshield blueprint/i }).click();

  await expect(page.getByRole("heading", { name: /fieldshield is the real product/i })).toBeVisible();
  await page.screenshot({ caret: "initial", path: testInfo.outputPath("fieldshield-purpose.png") });

  await page.getByRole("button", { name: /^council$/i }).click();
  await expect(page.getByText("Research Operations Agent", { exact: true })).toBeVisible();
  await page.screenshot({ caret: "initial", path: testInfo.outputPath("fieldshield-council.png") });

  await page.getByRole("button", { name: /^premortem$/i }).click();
  await expect(page.getByRole("heading", { name: /failure, before investment/i })).toBeVisible();

  await page.screenshot({ caret: "initial", path: testInfo.outputPath("fieldshield-premortem.png") });
  await page.getByRole("button", { name: /^creation order$/i }).click();
  await expect(page.getByText(/do not begin with the dashboard/i)).toBeVisible();
  await page.screenshot({ caret: "initial", path: testInfo.outputPath("fieldshield-order.png") });

  await page.getByRole("button", { name: /^build pack$/i }).click();
  await expect(page.getByRole("heading", { name: /seven-document build pack/i })).toBeVisible();
  await page.screenshot({ caret: "initial", path: testInfo.outputPath("fieldshield-build-pack.png") });

  await page.getByRole("button", { name: /^working proof$/i }).click();
  await expect(page.getByRole("heading", { name: /field operations dashboard/i })).toBeVisible();
  await page.screenshot({ caret: "initial", path: testInfo.outputPath("fieldshield-proof.png") });

  await page.getByRole("button", { name: /review Akinyele fieldwork/i }).click();
  await expect(page.getByText(/54 responses remaining/i)).toBeVisible();
  await page.getByRole("button", { name: /activate handover mode/i }).click();
  await expect(page.getByRole("status")).toContainText(/handover mode is active/i);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
