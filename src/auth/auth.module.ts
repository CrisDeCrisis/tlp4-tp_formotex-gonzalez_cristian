import { Router } from "express";
import { loginValidation } from "./validations/auth.validation.js";
import { handleValidationErrors } from "../helpers/handleValidationErrors.js";
import { VerifyJWT } from "../middlewares/verifyJWT.js";
import { getAuthController } from "../configs/dependencies.config.js";

const authRouter = Router();

const authCtrl = getAuthController();

authRouter.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authCtrl.login
);
authRouter.get("/session", VerifyJWT.verifyToken, authCtrl.session);
authRouter.get("/logout", VerifyJWT.verifyToken, authCtrl.logout);

export default authRouter;
