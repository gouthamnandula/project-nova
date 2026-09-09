import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-signal-500 text-hull-950 hover:bg-signal-400 active:bg-signal-600",
  secondary:
    "bg-transparent text-ink-100 border border-line-600 hover:border-ink-500 hover:bg-panel-700",
  ghost: "bg-transparent text-ink-300 hover:text-ink-100 hover:bg-panel-700",
  danger:
    "bg-transparent text-alert-400 border border-alert-500/40 hover:bg-alert-500/10 hover:border-alert-500",
};

const sizes: Record<Size, string> = {
  sm: "text-[13px] px-3 py-1.5",
  md: "text-sm px-4 py-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading, className, children, disabled, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
