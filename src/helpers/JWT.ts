import jwt, { type SignOptions } from "jsonwebtoken";
import envs from "../configs/envs.config.js";

export interface JWTPayload {
  id: string;
  email: string;
  role: string; // Rol del usuario (admin o user)
}

export class JWT {
  private static readonly SECRET_KEY = envs.JWT_SECRET;
  private static readonly EXPIRES_IN = envs.JWT_EXPIRES_IN;

  public static generateToken(payload: JWTPayload): string {
    if (!this.SECRET_KEY) {
      throw new Error("JWT_SECRET no está configurado");
    }

    return jwt.sign(payload, this.SECRET_KEY, {
      expiresIn: this.EXPIRES_IN,
    } as SignOptions);
  }

  public static verifyToken(token: string): JWTPayload {
    if (!this.SECRET_KEY) {
      throw new Error("JWT_SECRET no está configurado");
    }

    try {
      const decoded = jwt.verify(token, this.SECRET_KEY) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error("Error al verificar el token");
    }
  }
}
