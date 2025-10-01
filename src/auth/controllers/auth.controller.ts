import type { Request, Response } from "express";
import type { IAuthService } from "../interfaces/IAuthService.js";

export class AuthCtrl {
  constructor(private AuthService: IAuthService) {}

  login(req: Request, res: Response) {
    res.send(this.AuthService.login());
  }

  register(req: Request, res: Response) {
    res.send(this.AuthService.register());
  }

  auth(req: Request, res: Response) {
    res.send(this.AuthService.auth());
  }

  logout(req: Request, res: Response) {
    res.send(this.AuthService.logout());
  }
}
