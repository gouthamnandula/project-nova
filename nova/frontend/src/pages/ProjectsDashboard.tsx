import { useEffect, useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import AppShell from "../components/AppShell";
import ProjectCard from "../components/ProjectCard";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { TextField, TextAreaField } from "../components/Field";
import { EmptyState, ErrorBanner, Spinner } from "../components/Misc";
import { projectsApi } from "../api/client";
import type { Project } from "../types";
import { useAuth } from "../context/AuthContext";

export default function ProjectsDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setError(null);
    projectsApi
      .list()
      .then((res) => setProjects(res.projects))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load projects"));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setFormError("Project name is required");
      return;
    }
    setFormError(null);
    setCreating(true);
    try {
      await projectsApi.create({ name: name.trim(), description: description.trim() || undefined });
      setShowCreate(false);
      setName("");
      setDescription("");
      load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-8 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[13.5px] text-ink-500">
              {greeting}, {user?.name?.split(" ")[0]}
            </p>
            <h1 className="mt-1 font-display text-[28px] text-ink-100">Projects</h1>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} />
            New project
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorBanner message={error} />
          </div>
        )}

        {projects === null && !error ? (
          <Spinner label="Loading projects…" />
        ) : projects && projects.length === 0 ? (
          <EmptyState
            icon={<FolderOpen size={28} />}
            title="No projects yet"
            description="Create your first project to start organizing tasks and inviting your team."
            action={
              <Button onClick={() => setShowCreate(true)}>
                <Plus size={16} />
                New project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects?.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New project"
        description="Give your project a name your team will recognize."
      >
        <div className="flex flex-col gap-4">
          {formError && <ErrorBanner message={formError} />}
          <TextField
            label="Project name"
            placeholder="Q3 platform migration"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextAreaField
            label="Description"
            placeholder="What is this project about? (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={creating}>
              Create project
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
