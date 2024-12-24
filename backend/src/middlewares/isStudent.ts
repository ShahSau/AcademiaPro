import type { Request, Response, NextFunction } from "express";
import Student from "../models/Student";

const isStudent = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.token as string | undefined;

      // Find the user by ID from the token
      const user = await Student.findOne({ token });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: `Internal Server Error, ${err}` });
    }
  };
};

export default isStudent;
