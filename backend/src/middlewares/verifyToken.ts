import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";

dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token as string | undefined;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (!token) {
    return res.status(403).json({ message: "Token is not provided" });
  }

  jwt.verify(token, secret, (err) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }
    next();
  });
};

export default verifyToken;
