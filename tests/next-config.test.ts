import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("Next.js security headers", () => {
  it("applies a minimal browser security baseline to every route", async () => {
    expect(nextConfig.headers).toBeTypeOf("function");

    const rules = await nextConfig.headers!();
    const globalRule = rules.find((rule) => rule.source === "/(.*)");
    const headers = Object.fromEntries(
      globalRule?.headers.map((header) => [header.key, header.value]) ?? [],
    );

    expect(headers).toMatchObject({
      "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    });
  });
});
