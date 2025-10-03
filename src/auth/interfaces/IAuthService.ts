import type { AuthResult } from "../DTOs/authDTO.js";

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  auth(token: string): Promise<AuthResult>;
  logout(): Promise<AuthResult>;
}
