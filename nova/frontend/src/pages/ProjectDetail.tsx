import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Plus, Users } from "lucide-react";
import AppShell from "../components/AppShell";
import KanbanColumn from "../components/KanbanColumn";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { TextField, TextAreaField } from "../components/Field";
import { ErrorBanner, Spinner, ConfirmDialog } from "../components/Misc";
import { StatCard, ProgressBar } from "../components/StatCard";
import TaskFormModal, { type TaskFormValues } from "../components/TaskFormModal";
import { AddMemberModal, MemberRow } from "../components/MembersPanel";
import { projectsApi, tasksApi } from "../api/client";
import type { Project, ProjectMember, ProjectStats, Task, TaskStatus } from "../types";
import { useAuth } from "../context/AuthContext";

type Tab = "board" | "members";

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>("board");
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [confirmRemoveMember, setConfirmRemoveMember] = useState<ProjectMember | null>(null);

  const loadAll = useCallback(() => {
    if (!id) return;
    setError(null);
    Promise.all([
      projectsApi.get(id),
      projectsApi.stats(id),
      tasksApi.listForProject(id),
      projectsApi.members(id),
    ])
      .then(([p, s, t, m]) => {
        setProject(p.project);
        setStats(s);
        setTasks(t.tasks);
        setMembers(m.members);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load project"));
  }, [id]);

  useEffect(loadAll, [loadAll]);

  const refreshTasksAndStats = () => {
    if (!id) return;
    tasksApi.listForProject(id).then((r) => setTasks(r.tasks));
    projectsApi.stats(id).then(setStats);
  };

  const openNewTask = () => {
    setActiveTask(null);
    setTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setActiveTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (values: TaskFormValues) => {
    if (!id) return;
    setTaskSubmitting(true);
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        priority: values.priority,
        dueDate: values.dueDate || undefined,
        assigneeId: values.assigneeId || undefined,
      };
      if (activeTask) {
        await tasksApi.update(activeTask.id, { ...payload, status: values.status });
      } else {
        await tasksApi.create(id, { ...payload });
      }
      setTaskModalOpen(false);
      refreshTasksAndStats();
    } finally {
      setTaskSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!activeTask) return;
    await tasksApi.remove(activeTask.id);
    setConfirmDeleteTask(false);
    setTaskModalOpen(false);
    refreshTasksAndStats();
  };

  const handleEditProjectOpen = () => {
    if (!project) return;
    setEditName(project.name);
    setEditDescription(project.description ?? "");
    setEditError(null);
    setShowEditProject(true);
    setMenuOpen(false);
  };

  const handleSaveProject = async () => {
    if (!id) return;
    if (!editName.trim()) {
      setEditError("Project name is required");
      return;
    }
    setSavingProject(true);
    try {
      const res = await projectsApi.update(id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setProject(res.project);
      setShowEditProject(false);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;
    setDeletingProject(true);
    try {
      await projectsApi.remove(id);
      navigate("/projects");
    } finally {
      setDeletingProject(false);
    }
  };

  const handleAddMember = async (email: string) => {
    if (!id) return;
    setAddingMember(true);
    try {
      await projectsApi.addMember(id, email);
      setShowAddMember(false);
      const m = await projectsApi.members(id);
      setMembers(m.members);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!id || !confirmRemoveMember) return;
    await projectsApi.removeMember(id, confirmRemoveMember.userId);
    setConfirmRemoveMember(null);
    const m = await projectsApi.members(id);
    setMembers(m.members);
  };

  if (error) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-8 py-10">
          <ErrorBanner message={error} />
        </div>
      </AppShell>
    );
  }

  if (!project || !tasks) {
    return (
      <AppShell>
        <Spinner label="Loading project…" />
      </AppShell>
    );
  }

  const isOwner = user?.id === project.ownerId;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-8 py-10">
        <button
          onClick={() => navigate("/projects")}
          className="mb-5 flex items-center gap-1.5 text-[13px] text-ink-500 hover:text-ink-200"
        >
          <ArrowLeft size={14} />
          All projects
        </button>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] text-ink-100">{project.name}</h1>
            <p className="mt-1 max-w-xl text-[14px] text-ink-500">
              {project.description || "No description yet."}
            </p>
          </div>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="rounded-md border border-line-700 p-2 text-ink-400 hover:bg-panel-700 hover:text-ink-100"
                aria-label="Project options"
              >
                <MoreHorizontal size={17} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-10 mt-1.5 w-44 overflow-hidden rounded-md border border-line-700 bg-panel-800 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                  <button
                    onClick={handleEditProjectOpen}
                    className="w-full px-3.5 py-2 text-left text-[13px] text-ink-200 hover:bg-panel-700"
                  >
                    Edit project
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDeleteProject(true);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[13px] text-alert-400 hover:bg-panel-700"
                  >
                    Delete project
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total tasks" value={stats.totalTasks} />
            <StatCard label="To do" value={stats.todoTasks} />
            <StatCard label="In progress" value={stats.inProgressTasks} accent="orbit" />
            <StatCard label="Completed" value={stats.completedTasks} accent="thrive" />
          </div>
        )}

        {stats && stats.totalTasks > 0 && (
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar value={stats.progress} />
            </div>
            <span className="font-tabular text-[13px] text-ink-400">{stats.progress}% complete</span>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between border-b border-line-700">
          <div className="flex gap-5">
            {(["board", "members"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative pb-3 text-[13.5px] font-medium capitalize transition-colors ${
                  tab === t ? "text-ink-100" : "text-ink-500 hover:text-ink-300"
                }`}
              >
                {t === "board" ? "Board" : `Members (${members.length})`}
                {tab === t && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] bg-signal-500" />
                )}
              </button>
            ))}
          </div>
          {tab === "board" ? (
            <div className="pb-3">
              <Button size="sm" onClick={openNewTask}>
                <Plus size={14} />
                New task
              </Button>
            </div>
          ) : isOwner ? (
            <div className="pb-3">
              <Button size="sm" onClick={() => setShowAddMember(true)}>
                <Users size={14} />
                Add member
              </Button>
            </div>
          ) : null}
        </div>

        {tab === "board" ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onTaskClick={openEditTask}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {members.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                isOwner={m.userId === project.ownerId}
                canManage={isOwner}
                onRemove={() => setConfirmRemoveMember(m)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        onDelete={activeTask ? () => setConfirmDeleteTask(true) : undefined}
        members={members}
        task={activeTask}
        submitting={taskSubmitting}
      />

      <ConfirmDialog
        open={confirmDeleteTask}
        title="Delete task"
        description="This can't be undone. The task will be permanently removed."
        confirmLabel="Delete task"
        danger
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmDeleteTask(false)}
      />

      <Modal
        open={showEditProject}
        onClose={() => setShowEditProject(false)}
        title="Edit project"
      >
        <div className="flex flex-col gap-4">
          {editError && <ErrorBanner message={editError} />}
          <TextField
            label="Project name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextAreaField
            label="Description"
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowEditProject(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject} loading={savingProject}>
              Save changes
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDeleteProject}
        title="Delete project"
        description="This deletes the project along with all of its tasks and memberships. This can't be undone."
        confirmLabel="Delete project"
        danger
        loading={deletingProject}
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDeleteProject(false)}
      />

      <AddMemberModal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        onSubmit={handleAddMember}
        submitting={addingMember}
      />

      <ConfirmDialog
        open={!!confirmRemoveMember}
        title="Remove member"
        description={`Remove ${confirmRemoveMember?.user.name} from this project? They will lose access immediately.`}
        confirmLabel="Remove member"
        danger
        onConfirm={handleRemoveMember}
        onCancel={() => setConfirmRemoveMember(null)}
      />
    </AppShell>
  );
}
