import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  console.log(`Token: ${token}`);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`Decoded token: ${JSON.stringify(decoded, null, 2)}`);
    const user = await User.findById(decoded.id).select("-password");
    console.log(`User: ${user}`);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(`Error in authMiddleware: ${error.message}`);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
