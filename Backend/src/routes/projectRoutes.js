import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  restoreProject,
  permanentDeleteProject,
} from "../controllers/projectController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", adminMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", adminMiddleware, updateProject);
router.delete("/:id", adminMiddleware, deleteProject);
router.delete("/permanent/:id", adminMiddleware, permanentDeleteProject);
router.patch("/restore/:id", adminMiddleware, restoreProject);

export default router;
