import { Schema, model } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"]
        },
        description: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["To-Do", "In Progress", "Under Review", "Completed"],
            required: [true, "status is required"]
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "Urgent"],
            default: "Low"
        },
        deadline: {
            type: Date,
            default: null
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export const Task = model("Task", taskSchema);
