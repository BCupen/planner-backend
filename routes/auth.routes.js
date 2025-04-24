import express from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { JWT_SECRET, NODE_ENV } = process.env;

const authRouter = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register route
// @desc Register a new user
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password });
    const token = generateToken(newUser._id);
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
  } catch (error) {
    console.error(`Error in register: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
// @desc Login a user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route
// @desc Logout a user
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logout successful" });
});

export default authRouter;
