import type { UserRepository } from "../user/repositories/UserRepository.js";
import type { AuthResult } from "./DTOs/authDTO.js";
import type { IAuthService } from "./interfaces/IAuthService.js";

export class AuthService implements IAuthService {
  constructor(private userRepository: UserRepository) {}

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    return { success: true, message: "User registered successfully" };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    // const user = await this.userRepository.findByEmail(email);
    // TODO: Lógica de autenticación aquí
    return {
      success: true,
      message: "User logged in successfully",
      token: "JWT token",
    };
  }

  async session(token: string): Promise<AuthResult> {
    return { success: true, message: "Session endpoint", token };
  }

  async logout(): Promise<AuthResult> {
    // TODO: Cambiar a return void luego de finalizar el service
    return { success: true, message: "Logout endpoint" };
  }
}
