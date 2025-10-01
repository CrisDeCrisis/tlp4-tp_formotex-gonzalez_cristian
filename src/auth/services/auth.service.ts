import type { IAuthService } from "../interfaces/IAuthService.js";

// Crear un servicio de autenticación sin logica de negocio
export class AuthService implements IAuthService {
  login(): string {
    return "Login endpoint";
  }
  register(): string {
    return "Register endpoint";
  }
  auth(): string {
    return "Auth endpoint";
  }
  logout(): string {
    return "Logout endpoint";
  }
}
