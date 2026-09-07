import { Router } from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, addProjectMember, getProjectMembers, removeProjectMember, getProjectStats} from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";


const router = Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, getProjects);
router.get("/:id/stats", authenticate, getProjectStats);
router.get("/:id", authenticate, getProjectById);
router.put("/:id", authenticate, updateProject);
router.delete("/:id", authenticate, deleteProject);
router.post("/:id/members", authenticate, addProjectMember);
router.get("/:id/members", authenticate, getProjectMembers);
router.delete("/:id/members/:userId", authenticate, removeProjectMember);

export default router;