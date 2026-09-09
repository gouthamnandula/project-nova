import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../types";

const accentPalette = [
  "bg-signal-500",
  "bg-orbit-500",
  "bg-thrive-500",
  "bg-alert-500",
];

function accentFor(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return accentPalette[sum % accentPalette.length];
}

export default function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const initials = project.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-lg border border-line-700 bg-panel-800 p-5 text-left transition-colors hover:border-line-600"
    >
      <span className={`absolute inset-x-0 top-0 h-[3px] ${accentFor(project.id)}`} />
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line-700 bg-hull-900 font-display text-[15px] text-ink-300">
          {initials}
        </div>
        <ArrowUpRight
          size={17}
          className="text-ink-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-300"
        />
      </div>
      <div>
        <h3 className="font-display text-[17px] text-ink-100">{project.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-ink-500">
          {project.description || "No description yet."}
        </p>
      </div>
      <p className="text-[12px] text-ink-600">
        Created {new Date(project.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </button>
  );
}
