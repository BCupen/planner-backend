import express from "express";
import { connectDB } from "./config/db.js";
import todoRouter from "./routes/todo.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/todos", todoRouter);

app.listen(8686, () => {
  connectDB();
  console.log("Server has been started");
});
