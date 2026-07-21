import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[var(--accent-strong)] text-white hover:bg-[var(--accent)]",
    secondary: "border border-[var(--line-strong)] bg-white text-[var(--ink)] hover:bg-[var(--surface-muted)]",
    quiet: "text-[var(--accent-strong)] underline-offset-4 hover:underline",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

