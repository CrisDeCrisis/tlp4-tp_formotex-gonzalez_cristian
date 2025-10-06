import type { Request, Response } from "express";
import type { IAuthService } from "./interfaces/IAuthService.js";
import type { LoginDto } from "./DTOs/authDTO.js";

export class AuthCtrl {
  constructor(private authService: IAuthService) {}

  public login = async (req: Request, res: Response) => {
    const loginData: LoginDto = req.body;
    const result = await this.authService.login(
      loginData.email,
      loginData.password
    );
    return res.json(result);
  };

  public session = async (req: Request, res: Response) => {
    const token = req.cookies["token"];
    return res.send(await this.authService.session(token));
  };

  public logout = async (_req: Request, res: Response) => {
    return res.send(await this.authService.logout());
  };
}
