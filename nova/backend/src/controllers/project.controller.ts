import { Request, Response } from "express";
import prisma from "../prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const project = await prisma.project.create({
        data: {
            name,
            description,
            ownerId: req.userId,

            members: {
            create: {
                userId: req.userId,
                role: "OWNER",
            },
            },
        },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProjectById = async (
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

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateProject = async (
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
    const { name, description } = req.body;

    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteProject = async (
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

        const existingProject = await prisma.project.findFirst({
            where: {
                id,
                ownerId: req.userId,
            },
        });

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        await prisma.project.delete({
            where: {
                id,
            },
        });

        res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const addProjectMember = async (
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      return res.status(409).json({
        message: "User is already a project member",
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: user.id,
        role: "MEMBER",
      },
    });

    res.status(201).json({
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    console.error("Add project member error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProjectMembers = async (
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

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    res.json({
      members,
    });
  } catch (error) {
    console.error("Get project members error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const removeProjectMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { id, userId } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (userId === project.ownerId) {
      return res.status(400).json({
        message: "Project owner cannot be removed",
      });
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });

    res.json({
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove project member error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProjectStats = async (
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

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const totalTasks = await prisma.task.count({
      where: {
        projectId: id,
      },
    });

    const todoTasks = await prisma.task.count({
      where: {
        projectId: id,
        status: "TODO",
      },
    });

    const inProgressTasks = await prisma.task.count({
      where: {
        projectId: id,
        status: "IN_PROGRESS",
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        projectId: id,
        status: "DONE",
      },
    });

    const progress =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      progress,
    });
  } catch (error) {
    console.error("Get project stats error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};