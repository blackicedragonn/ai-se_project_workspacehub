import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController,
} from "../controllers/taskController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import commentRoutes from "./commentRoutes";

const router = Router();

router.use(asyncHandler(requireAuth));

router.get("/", asyncHandler(listTasksController));
router.post("/", asyncHandler(createTaskController));
router.get("/:id", asyncHandler(getTaskController));
router.patch("/:id", asyncHandler(updateTaskController));
router.delete("/:id", asyncHandler(deleteTaskController));

router.use("/:id/comments", commentRoutes);

export default router;
