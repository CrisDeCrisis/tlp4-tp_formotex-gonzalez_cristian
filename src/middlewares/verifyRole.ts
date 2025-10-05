import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../user/models/userModel.js";

export class VerifyRole {
  /**
   * Middleware para verificar que el usuario tenga el rol de ADMIN
   */
  static isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      // El usuario debe estar ya autenticado por VerifyJWT
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autenticado. Token requerido.",
        });
      }

      // Verificar que el usuario tenga rol de administrador
      if (req.user.role !== UserRole.ADMIN) {
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

  /**
   * Middleware para verificar que el usuario esté autenticado (cualquier rol)
   */
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

  /**
   * Middleware para verificar que el usuario sea admin o esté accediendo a su propio recurso
   */
  static isAdminOrOwner(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autenticado. Token requerido.",
        });
      }

      const userId = req.params.id;

      // Si es admin, puede acceder a cualquier recurso
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      // Si no es admin, solo puede acceder a su propio recurso
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
