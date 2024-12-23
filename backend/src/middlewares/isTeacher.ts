import { Request, Response, NextFunction } from "express";
import Teacher from "../models/Teacher";

const isTeacher = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.token as string | undefined;

      // Find the user by ID from the token
      const user = await Teacher.findOne({ token });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error("Authorization error: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default isTeacher;
