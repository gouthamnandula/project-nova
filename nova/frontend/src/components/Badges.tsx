import clsx from "clsx";
import type { TaskPriority, TaskStatus } from "../types";

const statusMeta: Record<TaskStatus, { label: string; dot: string; text: string }> = {
  TODO: { label: "To do", dot: "bg-ink-500", text: "text-ink-300" },
  IN_PROGRESS: { label: "In progress", dot: "bg-orbit-500", text: "text-orbit-400" },
  DONE: { label: "Done", dot: "bg-thrive-500", text: "text-thrive-400" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const meta = statusMeta[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-[12.5px] font-medium", meta.text)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

const priorityMeta: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "border-line-600 text-ink-500" },
  MEDIUM: { label: "Medium", className: "border-signal-500/40 text-signal-400" },
  HIGH: { label: "High", className: "border-alert-500/50 text-alert-400" },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const meta = priorityMeta[priority];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}
