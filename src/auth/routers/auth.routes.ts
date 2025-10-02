import { Router } from "express";
import { AuthCtrl } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import { handleValidationErrors } from "../middlewares/auth.middleware.js";

const authRouter = Router();
const authCtrl = new AuthCtrl(new AuthService());

authRouter.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authCtrl.register
);
authRouter.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authCtrl.login
);
authRouter.post("/auth", authCtrl.auth);
authRouter.post("/logout", authCtrl.logout);

export default authRouter;
