import type { IAuthService } from "../controllers/interfaces/IAuthService.js";

// Crear un servicio de autenticación sin logica de negocio
export class AuthService implements IAuthService {
  async login(): Promise<string> {
    return "Login endpoint";
  }
  async register(): Promise<string> {
    return "Register endpoint";
  }
  async auth(): Promise<string> {
    return "Auth endpoint";
  }
  async logout(): Promise<string> {
    return "Logout endpoint";
  }
}
