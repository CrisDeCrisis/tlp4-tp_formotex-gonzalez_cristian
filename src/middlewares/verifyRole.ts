import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../user/models/userModel.js";

export class VerifyRole {
  static isSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autenticado. Token requerido.",
        });
      }

      if (req.user.role !== UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message:
            "Acceso denegado. Se requieren permisos de super administrador.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
      });
    }
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autenticado. Token requerido.",
        });
      }

      if (
        req.user.role !== UserRole.ADMIN &&
        req.user.role !== UserRole.SUPER_ADMIN
      ) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado. Se requieren permisos de administrador.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
      });
    }
  }

  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autenticado. Token requerido.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al verificar autenticación",
      });
    }
  }

  static isAdminOrOwner(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autenticado. Token requerido.",
        });
      }

      const userId = req.params.id;

      if (
        req.user.role === UserRole.ADMIN ||
        req.user.role === UserRole.SUPER_ADMIN
      ) {
        return next();
      }

      if (req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          message:
            "Acceso denegado. Solo puedes acceder a tus propios recursos.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
      });
    }
  }
}
