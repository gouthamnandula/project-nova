import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line-700 px-6 py-16 text-center">
      {icon && <div className="text-ink-600">{icon}</div>}
      <div className="space-y-1">
        <p className="font-display text-[18px] text-ink-100">{title}</p>
        <p className="mx-auto max-w-sm text-[13.5px] text-ink-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-alert-500/40 bg-alert-500/10 px-3.5 py-2.5 text-[13.5px] text-alert-400">
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-ink-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line-600 border-t-signal-500" />
      {label && <span className="text-[13.5px]">{label}</span>}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description}>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
