import type { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";

const isTeacherORAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token as string;
    if (!token) {
      return res.status(401).json({ message: "Access denied, token missing" });
    }
    // Find the user by ID from the token
    const user = await Admin.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is an admin
    if (user.role !== "admin" && user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied, not an admin nor a teacher" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error, ${err}` });
  }
};

export default isTeacherORAdmin;
