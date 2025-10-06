import type { Request, Response } from "express";
import type { IUserService } from "./user.service.js";
import type { CreateUserDto, UpdateUserDto } from "./DTOs/userDTO.js";

export class UserController {
  constructor(private userService: IUserService) {}

  public createUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.userService.createUser(userData);
      return res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: newUser,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al crear usuario",
      });
    }
  };

  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id!);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al obtener usuario",
      });
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.userService.getAllUsers(page, limit);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al obtener usuarios",
      });
    }
  };

  public updateUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;

      const updatedUser = await this.userService.updateUser(id!, userData);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar usuario",
      });
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const deleted = await this.userService.deleteUser(id!);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al eliminar usuario",
      });
    }
  };

  public deactivateUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const user = await this.userService.deactivateUser(id!);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario desactivado exitosamente",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al desactivar usuario",
      });
    }
  };

  public activateUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const user = await this.userService.activateUser(id!);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario activado exitosamente",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al activar usuario",
      });
    }
  };

  public promoteToAdmin = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const promotedUser = await this.userService.promoteToAdmin(id!);

      if (!promotedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario promovido a administrador exitosamente",
        data: promotedUser,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al promover usuario",
      });
    }
  };

  public getProfile = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message: "No autenticado",
        });
      }

      const user = await this.userService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al obtener perfil",
      });
    }
  };
}
