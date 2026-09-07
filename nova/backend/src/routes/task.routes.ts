import { Router } from "express";

import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/projects/:projectId/tasks",
  authenticate,
  createTask
);

router.get(
  "/projects/:projectId/tasks",
  authenticate,
  getProjectTasks
);

router.get(
  "/tasks/:id",
  authenticate,
  getTaskById
);

router.put(
  "/tasks/:id",
  authenticate,
  updateTask
);

router.delete(
  "/tasks/:id",
  authenticate,
  deleteTask
);

export default router;