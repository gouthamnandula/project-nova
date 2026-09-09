import type { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";

const columnMeta: Record<TaskStatus, { title: string; dot: string }> = {
  TODO: { title: "To do", dot: "bg-ink-500" },
  IN_PROGRESS: { title: "In progress", dot: "bg-orbit-500" },
  DONE: { title: "Done", dot: "bg-thrive-500" },
};

export default function KanbanColumn({
  status,
  tasks,
  onTaskClick,
}: {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  const meta = columnMeta[status];

  return (
    <div className="flex w-[300px] shrink-0 flex-col rounded-lg border border-line-700 bg-hull-900">
      <div className="flex items-center gap-2 border-b border-line-700 px-3.5 py-3">
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
        <h3 className="text-[13px] font-medium text-ink-200">{meta.title}</h3>
        <span className="ml-auto rounded-full bg-panel-700 px-1.5 py-0.5 text-[11px] text-ink-500 font-tabular">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2.5">
        {tasks.length === 0 ? (
          <p className="px-1 py-6 text-center text-[12.5px] text-ink-600">
            Nothing here yet.
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))
        )}
      </div>
    </div>
  );
}
