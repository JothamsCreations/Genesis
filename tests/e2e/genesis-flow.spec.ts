import { expect, test } from "@playwright/test";

test("a builder can turn an idea into a Codex-ready blueprint", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /turn an idea into a buildable product/i })).toBeVisible();
  await page.getByRole("button", { name: /use sample idea/i }).click();
  await page.getByRole("button", { name: /shape the blueprint/i }).click();

  await expect(page.getByRole("heading", { name: /your genesis blueprint/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /premortem/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /ordered build plan/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /codex-ready task/i })).toBeVisible();
});

test("a room-comfort idea produces a specific and safety-aware blueprint", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel(/describe what you want to create/i).fill(
    "An app that helps people live in a comfortable space. If I take a picture of the room and describe my challenges, it tells me what to do.",
  );
  await page.getByRole("button", { name: /shape the blueprint/i }).click();

  await expect(page.getByRole("heading", { name: /your genesis blueprint/i })).toBeVisible();
  await expect(page.getByText("Roomwise", { exact: true })).toBeVisible();
  await expect(page.getByText("Guided room capture", { exact: true })).toBeVisible();
  await expect(page.getByText(/photo misses the real source of discomfort/i)).toBeVisible();
  await expect(page.getByText(/guided photo-to-comfort plan/i)).toBeVisible();
});

test("the core journey does not overflow a mobile viewport", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /use sample idea/i }).click();
  await page.getByRole("button", { name: /shape the blueprint/i }).click();
  await expect(page.getByRole("heading", { name: /your genesis blueprint/i })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
});

test("captures the completed blueprint for visual review", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.screenshot({ caret: "initial", path: testInfo.outputPath("idea-intake.png") });
  await page.getByRole("button", { name: /use sample idea/i }).click();
  await page.getByRole("button", { name: /shape the blueprint/i }).click();
  await expect(page.getByRole("heading", { name: /your genesis blueprint/i })).toBeVisible();

  await page.screenshot({ caret: "initial", path: testInfo.outputPath("blueprint-viewport.png") });
  if (testInfo.project.name === "mobile-chrome") {
    await page.screenshot({ caret: "initial", fullPage: true, path: testInfo.outputPath("blueprint-full.png") });
  }
});

test("downloads the Codex build pack with a meaningful filename", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /use sample idea/i }).click();
  await page.getByRole("button", { name: /shape the blueprint/i }).click();
  await expect(page.getByRole("heading", { name: /your genesis blueprint/i })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download markdown/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("learning-signal-build-pack.md");
});

test("serves the production browser security baseline", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("keeps small interface copy above WCAG AA contrast", async ({ page }) => {
  await page.goto("/");

  const results = await page.evaluate(() => {
    const selectors = [
      ".site-header p",
      ".prototype-note",
      ".intake-lede",
      ".field-guidance",
      ".privacy-note",
      ".preview-sheet > p",
      ".preview-register p",
    ];

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;

    function rgba(color: string) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      return [red, green, blue, alpha / 255] as const;
    }

    function composite(foreground: readonly number[], background: readonly number[]) {
      const alpha = foreground[3] + background[3] * (1 - foreground[3]);
      if (alpha === 0) return [255, 255, 255, 1];
      return [
        (foreground[0] * foreground[3] + background[0] * background[3] * (1 - foreground[3])) / alpha,
        (foreground[1] * foreground[3] + background[1] * background[3] * (1 - foreground[3])) / alpha,
        (foreground[2] * foreground[3] + background[2] * background[3] * (1 - foreground[3])) / alpha,
        alpha,
      ];
    }

    function effectiveBackground(element: Element | null): readonly number[] {
      if (!element) return [255, 255, 255, 1];
      const current = rgba(getComputedStyle(element).backgroundColor);
      if (current[3] === 1) return current;
      return composite(current, effectiveBackground(element.parentElement));
    }

    function luminance(color: readonly number[]) {
      const channels = color.slice(0, 3).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }

    return selectors.map((selector) => {
      const element = document.querySelector(selector)!;
      const foreground = rgba(getComputedStyle(element).color);
      const background = effectiveBackground(element);
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));
      return { selector, ratio: (lighter + 0.05) / (darker + 0.05) };
    });
  });

  for (const result of results) {
    expect(result.ratio, `${result.selector} contrast`).toBeGreaterThanOrEqual(4.5);
  }
});
