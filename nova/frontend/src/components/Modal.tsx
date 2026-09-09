import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  width?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-hull-950/70 px-4 py-10 backdrop-blur-sm">
      <div
        className={`w-full ${width} rounded-lg border border-line-700 bg-panel-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)]`}
      >
        <div className="flex items-start justify-between border-b border-line-700 px-5 py-4">
          <div>
            <h2 className="font-display text-[19px] text-ink-100">{title}</h2>
            {description && (
              <p className="mt-1 text-[13px] text-ink-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-500 hover:bg-panel-700 hover:text-ink-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
