import type { Request, Response, NextFunction } from "express";
import Teacher from "../models/Teacher";

const isTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token as string;
    if (!token) {
      return res.status(401).json({ message: "Access denied, token missing" });
    }
    // Find the user by ID from the token
    const user = await Teacher.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is a teacher
    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied, not a teacher" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error, ${err}` });
  }
};

export default isTeacher;
