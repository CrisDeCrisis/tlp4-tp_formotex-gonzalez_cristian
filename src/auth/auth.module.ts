import { Router } from "express";
import { AuthCtrl } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import {
  loginValidation,
  registerValidation,
} from "./validations/auth.validation.js";
import { handleValidationErrors } from "../helpers/handleValidationErrors.js";
import { VerifyJWT } from "../middlewares/verifyJWT.js";

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
authRouter.get("/session", VerifyJWT.verifyToken, authCtrl.session);
authRouter.get("/logout", VerifyJWT.verifyToken, authCtrl.logout);

export default authRouter;
