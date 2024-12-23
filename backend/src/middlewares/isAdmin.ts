import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';


const isAdmin = (model: Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.token as string | undefined;

      // Find the user by ID from the token
      const user = await model.findOne({token}).select("role");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is an admin
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied, not an admin" });
      }

      next();
    } catch (err) {
      console.error("Authorization error: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default isAdmin;