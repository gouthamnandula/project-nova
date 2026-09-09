import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, Radio } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-hull-950">
      <aside className="flex w-[236px] shrink-0 flex-col border-r border-line-700 bg-hull-900">
        <div className="flex items-center gap-2 px-5 py-6">
          <Radio size={20} className="text-signal-500" strokeWidth={2.25} />
          <span className="font-display text-[21px] tracking-tight text-ink-100">
            NOVA
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 px-3">
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors ${
                isActive
                  ? "bg-panel-700 text-ink-100"
                  : "text-ink-500 hover:bg-panel-800 hover:text-ink-200"
              }`
            }
          >
            <LayoutGrid size={16} />
            Projects
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-line-700 px-3 py-4">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-700 font-display text-[14px] text-signal-400">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink-100">
                {user?.name}
              </p>
              <p className="truncate text-[12px] text-ink-600">{user?.email}</p>
            </div>
            <button
              aria-label="Sign out"
              title="Sign out"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-md p-1.5 text-ink-600 hover:bg-panel-700 hover:text-ink-200"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
