import type { Request, Response } from "express";
import type { IAuthService } from "./interfaces/IAuthService.js";

export class AuthCtrl {
  constructor(private AuthService: IAuthService) {}

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    return res.send(await this.AuthService.login(email, password));
  };

  public register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    return res.send(await this.AuthService.register(name, email, password));
  };

  public auth = async (req: Request, res: Response) => {
    const token = req.cookies["token"];
    return res.send(await this.AuthService.auth());
  };

  public logout = async (_req: Request, res: Response) => {
    return res.send(await this.AuthService.logout());
  };
}
