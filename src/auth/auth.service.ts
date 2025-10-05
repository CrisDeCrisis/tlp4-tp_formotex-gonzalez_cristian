import type { IUserService } from "../user/user.service.js";
import type { AuthResult } from "./DTOs/authDTO.js";
import type { IAuthService } from "./interfaces/IAuthService.js";
import { JWT } from "../helpers/JWT.js";
import { UserRole } from "../user/models/userModel.js";

export class AuthService implements IAuthService {
  constructor(private userService: IUserService) {}

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    try {
      const newUser = await this.userService.createUser({
        name,
        email,
        password,
        role: UserRole.USER,
      });

      const token = JWT.generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return {
        success: true,
        message: "Usuario registrado exitosamente",
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al registrar usuario: ${error}`,
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const user = await this.userService.validateUserCredentials(
        email,
        password
      );

      if (!user) {
        return {
          success: false,
          message: "Credenciales inválidas o usuario inactivo",
        };
      }

      const token = JWT.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: "Inicio de sesión exitoso",
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al iniciar sesión: ${error}`,
      };
    }
  }

  async session(token: string): Promise<AuthResult> {
    try {
      const decoded = JWT.verifyToken(token);

      const user = await this.userService.getUserById(decoded.id);

      if (!user) {
        return {
          success: false,
          message: "Usuario no encontrado",
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: "Usuario inactivo",
        };
      }

      return {
        success: true,
        message: "Sesión válida",
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: "Token inválido o expirado",
      };
    }
  }

  async logout(): Promise<AuthResult> {
    return {
      success: true,
      message: "Sesión cerrada exitosamente",
    };
  }
}
