import { Router } from "express";
import { AuthCtrl } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { loginValidation } from "./validations/auth.validation.js";
import { handleValidationErrors } from "../helpers/handleValidationErrors.js";
import { VerifyJWT } from "../middlewares/verifyJWT.js";
import { UserRepository } from "../user/repositories/UserRepository.js";
import { UserService } from "../user/user.service.js";

const authRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userService);
const authCtrl = new AuthCtrl(authService);

authRouter.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authCtrl.login
);
authRouter.get("/session", VerifyJWT.verifyToken, authCtrl.session);
authRouter.get("/logout", VerifyJWT.verifyToken, authCtrl.logout);

export default authRouter;
