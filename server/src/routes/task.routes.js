import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createTask,
    updateTask,
    deleteTask,
    getTask
} from "../controllers/task.controller.js";
const router = Router();

router.route("/").post(verifyJWT, createTask);
router
    .route("/:taskId")
    .put(verifyJWT, updateTask)
    .delete(verifyJWT, deleteTask)
    .get(verifyJWT, getTask);

export default router;
