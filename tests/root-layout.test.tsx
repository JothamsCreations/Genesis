import { isValidElement } from "react";
import { describe, expect, it } from "vitest";

import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("tolerates browser-extension attributes on the body without suppressing nested warnings", () => {
    const layout = RootLayout({ children: <main>GENESIS</main> });

    expect(isValidElement(layout)).toBe(true);
    expect(isValidElement(layout.props.children)).toBe(true);
    expect(layout.props.children.props.suppressHydrationWarning).toBe(true);
    expect(layout.props.suppressHydrationWarning).toBeUndefined();
  });
});
