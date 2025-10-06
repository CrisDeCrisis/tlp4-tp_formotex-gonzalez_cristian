import { Router, type Request, type Response } from "express";
import { loginValidation } from "./validations/auth.validation.js";
import { handleValidationErrors } from "../helpers/handleValidationErrors.js";
import { VerifyJWT } from "../middlewares/verifyJWT.js";
import { getAuthController } from "../configs/dependencies.config.js";

const authRouter = Router();

authRouter.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getAuthController().login(req, res)
);

authRouter.get(
  "/session",
  VerifyJWT.verifyToken,
  (req: Request, res: Response) => getAuthController().session(req, res)
);

authRouter.get(
  "/logout",
  VerifyJWT.verifyToken,
  (req: Request, res: Response) => getAuthController().logout(req, res)
);

export default authRouter;
