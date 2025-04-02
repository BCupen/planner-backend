import express from "express";
import Todo from "../models/todo.model.js";

const todoRouter = express.Router();

todoRouter.post("/", async (req, res) => {
    const todo = req.body;

    if(!todo.title || !todo.description || !todo.priority || !todo.dueDate){
        return res.status(400).json({ success: false, message: "Missing fields"});
    }

    const newTodo = new Todo(todo);

    try{
        await newTodo.save();
        return res.status(201).json({success:true, message: "Todo created", data: newTodo});
    } catch(error) {
        console.log(`Error saving todo: ${error.message}`);
        return res.status(500).json({success: false, message: "Error saving todo"});
    }
})

export default todoRouter;
