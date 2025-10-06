import type { Request, Response, NextFunction } from "express";
import { JWT, type JWTPayload } from "../helpers/JWT.js";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class VerifyJWT {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Token no proporcionado. Use: Authorization: Bearer <token>",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = JWT.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
