import type {
  Project,
  ProjectMember,
  ProjectStats,
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "nova.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const message =
      (body as { message?: string } | null)?.message ||
      `Request failed with status ${res.status}`;
    throw new ApiRequestError(message, res.status);
  }

  return body as T;
}

// --- Auth ---
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ message: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<{ message: string; token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request<{ user: User }>("/auth/me"),
};

// --- Projects ---
export const projectsApi = {
  list: () => request<{ projects: Project[] }>("/projects"),
  get: (id: string) => request<{ project: Project }>(`/projects/${id}`),
  create: (data: { name: string; description?: string }) =>
    request<{ message: string; project: Project }>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { name?: string; description?: string }) =>
    request<{ message: string; project: Project }>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ message: string }>(`/projects/${id}`, { method: "DELETE" }),
  stats: (id: string) =>
    request<ProjectStats>(`/projects/${id}/stats`),

  members: (id: string) =>
    request<{ members: ProjectMember[] }>(`/projects/${id}/members`),
  addMember: (id: string, email: string) =>
    request<{ message: string; member: ProjectMember }>(
      `/projects/${id}/members`,
      { method: "POST", body: JSON.stringify({ email }) }
    ),
  removeMember: (id: string, userId: string) =>
    request<{ message: string }>(`/projects/${id}/members/${userId}`, {
      method: "DELETE",
    }),
};

// --- Tasks ---
export const tasksApi = {
  listForProject: (projectId: string) =>
    request<{ tasks: Task[] }>(`/projects/${projectId}/tasks`),
  get: (id: string) => request<{ task: Task }>(`/tasks/${id}`),
  create: (
    projectId: string,
    data: {
      title: string;
      description?: string;
      priority?: TaskPriority;
      dueDate?: string;
      assigneeId?: string;
    }
  ) =>
    request<{ message: string; task: Task }>(
      `/projects/${projectId}/tasks`,
      { method: "POST", body: JSON.stringify(data) }
    ),
  update: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: string | null;
      assigneeId: string;
    }>
  ) =>
    request<{ message: string; task: Task }>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ message: string }>(`/tasks/${id}`, { method: "DELETE" }),
};

export const health = () =>
  request<{ status: string; database: string }>("/health");
