export type ProjectRole = "OWNER" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  role: ProjectRole;
  joinedAt: string;
  projectId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assigneeId: string | null;
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface ProjectStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  progress: number;
}

export interface ApiError {
  message: string;
}
