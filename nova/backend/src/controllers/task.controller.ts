import { Response } from "express";
import prisma from "../prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { projectId } = req.params;
    const {
      title,
      description,
      priority,
      dueDate,
      assigneeId,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (assigneeId) {
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: assigneeId,
          },
        },
      });

      if (!member) {
        return res.status(400).json({
          message: "Assignee is not a member of this project",
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId,
        assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProjectTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      tasks,
    });
  } catch (error) {
    console.error("Get project tasks error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          ownerId: req.userId,
        },
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
    } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          ownerId: req.userId,
        },
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (assigneeId) {
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: existingTask.projectId,
            userId: assigneeId,
          },
        },
      });

      if (!member) {
        return res.status(400).json({
          message: "Assignee is not a member of this project",
        });
      }
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          ownerId: req.userId,
        },
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};