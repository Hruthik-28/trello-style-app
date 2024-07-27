import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Task } from "../models/task.model.js";

const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;
    const user = req.user;

    if ([title, status].some((field) => field.trim() === "")) {
        throw new ApiError(400, "Title and Status fields are mandatory.");
    }

    const task = await Task.create({
        title,
        description: description || "",
        status,
        priority: priority || "Low",
        deadline: deadline || null,
        user: user._id
    });

    if (!task) {
        throw new ApiError(500, "Failed to create task");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created sucessFully"));
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, priority, deadline } = req.body;
    const user = req.user;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required.");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    if (task.user.toString() !== user._id.toString()) {
        throw new ApiError(403, "Only task owner can edit thier tasks");
    }

    const updateData = {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        status: status !== undefined ? status : task.status,
        priority: priority !== undefined ? priority : task.priority,
        deadline: deadline !== undefined ? deadline : task.deadline
    };

    const updatedTask = await Task.findByIdAndUpdate(task._id, updateData, {
        new: true
    });

    if (!updatedTask) {
        throw new ApiError(500, "Failed to update task.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const user = req.user;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required.");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found.");
    }

    if (task.user.toString() !== user._id.toString()) {
        throw new ApiError(403, "Only task owner can delete thier tasks");
    }

    const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        user: user._id
    });

    if (!deletedTask) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const getTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const user = req.user;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required.");
    }

    const task = await Task.findOne({ _id: taskId, user: user._id });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task fetched successfully"));
});

export { createTask, updateTask, deleteTask, getTask };
