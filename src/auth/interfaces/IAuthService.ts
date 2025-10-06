import type { AuthResult } from "../DTOs/authDTO.js";

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  session(token: string): Promise<AuthResult>;
  logout(): Promise<AuthResult>;
}
