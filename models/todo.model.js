import mongoose, { mongo } from "mongoose";
import Priority from "../types/PriorityEnum.js";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        required: true       
    },
    dueDate: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;