import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

const fieldWrapper = "flex flex-col gap-1.5";
const labelClass = "text-[13px] font-medium text-ink-300";
const inputBase =
  "w-full rounded-md border border-line-700 bg-hull-900 px-3 py-2 text-[14px] text-ink-100 placeholder:text-ink-600 outline-none transition-colors focus:border-signal-500";

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FieldShell({ label, hint, error, children }: FieldShellProps) {
  return (
    <div className={fieldWrapper}>
      {label && <label className={labelClass}>{label}</label>}
      {children}
      {hint && !error && <span className="text-[12px] text-ink-600">{hint}</span>}
      {error && <span className="text-[12px] text-alert-400">{error}</span>}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, error, className, ...rest }, ref) => (
    <FieldShell label={label} hint={hint} error={error}>
      <input ref={ref} className={clsx(inputBase, className)} {...rest} />
    </FieldShell>
  )
);
TextField.displayName = "TextField";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, hint, error, className, ...rest }, ref) => (
    <FieldShell label={label} hint={hint} error={error}>
      <textarea ref={ref} className={clsx(inputBase, "resize-none", className)} {...rest} />
    </FieldShell>
  )
);
TextAreaField.displayName = "TextAreaField";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, hint, error, className, children, ...rest }, ref) => (
    <FieldShell label={label} hint={hint} error={error}>
      <select ref={ref} className={clsx(inputBase, "cursor-pointer")} {...rest}>
        {children}
      </select>
    </FieldShell>
  )
);
SelectField.displayName = "SelectField";
