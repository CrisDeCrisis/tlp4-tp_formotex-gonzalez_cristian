import { Router } from "express";
import { AuthCtrl } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";

const authRouter = Router();
const authCtrl = new AuthCtrl(new AuthService());

authRouter.post("/login", authCtrl.login);
authRouter.post("/register", authCtrl.register);
authRouter.post("/auth", authCtrl.auth);
authRouter.post("/logout", authCtrl.logout);

export default authRouter;
