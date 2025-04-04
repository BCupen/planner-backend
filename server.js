import express from "express";
import { connectDB } from "./config/db.js";
import todoRouter from "./routes/todo.routes.js";

const app = express();

app.use(express.json());

app.use("/todos", todoRouter);

app.listen(8686, () => {
    connectDB();
    console.log("Server has been started");
})