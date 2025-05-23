import express from "express";
import Todo from "../models/todo.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const todoRouter = express.Router();

todoRouter.use(authMiddleware);

// POST new todo
todoRouter.post("/", async (req, res) => {
  console.log(`req.user: ${req.user}`);
  const todo = new Todo({
    ...req.body,
    user: req.user._id,
  });

  if (!todo.title || !todo.description || !todo.priority || !todo.dueDate) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const newTodo = new Todo(todo);

  try {
    await newTodo.save();
    return res
      .status(201)
      .json({ success: true, message: "Todo created", data: newTodo });
  } catch (error) {
    console.log(`Error saving todo: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Error saving todo" });
  }
});

// GET all todos
todoRouter.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log(`Todos: ${todos}`);
    return res.status(200).json(todos);
  } catch (error) {
    console.log(`Error fetching todos: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error fetching todos",
    });
  }
});

// GET todo by id
todoRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findById(id);
    console.log(`Todo: ${todo}`);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json(todo);
  } catch (error) {
    console.log(`Error getting todo with id ${id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error getting todo with id ${id}: ${error.message}`,
    });
  }
});

// DELETE todo by id
todoRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findByIdAndDelete(id);
    console.log(`Todo deleted: ${todo}`);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Todo successfull deleted",
    });
  } catch (error) {
    console.log(`Error deleting todo: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error deleting todo",
    });
  }
});

// PATCH todo
todoRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedTodo = req.body;
  try {
    const newTodo = await Todo.findByIdAndUpdate(id, updatedTodo, {
      new: true,
      runValidators: true,
    });
    if (!newTodo) {
      return res.status(404).json({
        success: true,
        error: "Todo not found",
      });
    }
    console.log(`Todo updated: ${newTodo}`);
    return res.status(200).json(newTodo);
  } catch (error) {
    console.log(`Error updating todo: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error updating todo",
    });
  }
});
export default todoRouter;
