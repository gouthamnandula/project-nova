import { Calendar } from "lucide-react";
import type { Task } from "../types";
import { PriorityBadge } from "./Badges";

function formatDue(date: string | null) {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  const overdue = d < new Date(now.toDateString()) ;
  return {
    label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    overdue,
  };
}

export default function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const due = formatDue(task.dueDate);

  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col gap-2.5 rounded-md border border-line-700 bg-panel-800 p-3 text-left transition-colors hover:border-line-600"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13.5px] font-medium leading-snug text-ink-100">
          {task.title}
        </p>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="line-clamp-2 text-[12.5px] text-ink-500">{task.description}</p>
      )}
      <div className="flex items-center justify-between pt-0.5">
        {due ? (
          <span
            className={`flex items-center gap-1 text-[11.5px] ${
              due.overdue && task.status !== "DONE" ? "text-alert-400" : "text-ink-600"
            }`}
          >
            <Calendar size={12} />
            {due.label}
          </span>
        ) : (
          <span />
        )}
        {task.assignee ? (
          <span
            title={task.assignee.name}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-hull-900 text-[10px] font-medium text-ink-300 border border-line-700"
          >
            {task.assignee.name[0]?.toUpperCase()}
          </span>
        ) : (
          <span className="text-[11px] text-ink-600">Unassigned</span>
        )}
      </div>
    </button>
  );
}
