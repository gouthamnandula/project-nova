import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";
import authRoutes from "./routes/auth.routes";
import { authenticate, AuthRequest } from "./middleware/auth.middleware";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", taskRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "NOVA API is running 🚀",
  });
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "ERROR",
      database: "disconnected",
    });
  }
});

app.get("/protected", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "You accessed a protected route!",
    userId: req.userId,
  });
});

export default app;