import type { Request } from "express";

interface AuthRequest extends Request {
  token: string;
  email: string;
}

export default AuthRequest;
