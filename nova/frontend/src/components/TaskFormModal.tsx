import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import { TextField, TextAreaField, SelectField } from "./Field";
import { ErrorBanner } from "./Misc";
import type { ProjectMember, Task, TaskPriority, TaskStatus } from "../types";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
}

export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  members,
  task,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onDelete?: () => void;
  members: ProjectMember[];
  task?: Task | null;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (task) {
      setValues({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        assigneeId: task.assigneeId ?? "",
      });
    } else {
      setValues({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
        assigneeId: "",
      });
    }
  }, [open, task]);

  const handleSubmit = async () => {
    if (!values.title.trim()) {
      setError("Task title is required");
      return;
    }
    setError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Edit task" : "New task"}
      description={task ? undefined : "Add a task to this project's board."}
      width="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        {error && <ErrorBanner message={error} />}
        <TextField
          label="Title"
          placeholder="Design the onboarding flow"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          autoFocus
        />
        <TextAreaField
          label="Description"
          placeholder="Add any useful context (optional)"
          rows={3}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-3">
          {task && (
            <SelectField
              label="Status"
              value={values.status}
              onChange={(e) =>
                setValues((v) => ({ ...v, status: e.target.value as TaskStatus }))
              }
            >
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </SelectField>
          )}
          <SelectField
            label="Priority"
            value={values.priority}
            onChange={(e) =>
              setValues((v) => ({ ...v, priority: e.target.value as TaskPriority }))
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </SelectField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Due date"
            type="date"
            value={values.dueDate}
            onChange={(e) => setValues((v) => ({ ...v, dueDate: e.target.value }))}
          />
          <SelectField
            label="Assignee"
            value={values.assigneeId}
            onChange={(e) => setValues((v) => ({ ...v, assigneeId: e.target.value }))}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.user.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-1 flex items-center justify-between">
          {task && onDelete ? (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-[13px] text-alert-400 hover:text-alert-300"
            >
              <Trash2 size={14} />
              Delete task
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              {task ? "Save changes" : "Create task"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
