import express from "express";
import { connectDB } from "./config/db.js";
import todoRouter from "./routes/todo.routes.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/todos", todoRouter);
app.use("/auth", authRouter);

app.listen(8686, () => {
  connectDB();
  console.log("Server has been started");
});
