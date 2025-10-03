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
      // !! Para el ambiente de desarrollo se envia el token por body
      // todo: cambiar a envio por cookies al terminar la implementación
      const token = req.body.token;

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
