import { Router, type Request, type Response } from "express";
import { VerifyJWT } from "../middlewares/verifyJWT.js";
import { VerifyRole } from "../middlewares/verifyRole.js";
import {
  createUserValidation,
  updateUserValidation,
  getUserByIdValidation,
  deleteUserValidation,
  paginationValidation,
} from "./validations/user.validation.js";
import { handleValidationErrors } from "../helpers/handleValidationErrors.js";
import { getUserController } from "../configs/dependencies.config.js";

const userRouter = Router();

userRouter.get(
  "/profile",
  VerifyJWT.verifyToken,
  (req: Request, res: Response) => getUserController().getProfile(req, res)
);

userRouter.patch(
  "/:id/promote",
  VerifyJWT.verifyToken,
  VerifyRole.isSuperAdmin,
  getUserByIdValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().promoteToAdmin(req, res)
);

userRouter.post(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  createUserValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().createUser(req, res)
);

userRouter.get(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  paginationValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().getAllUsers(req, res)
);

userRouter.delete(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  deleteUserValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().deleteUser(req, res)
);

userRouter.patch(
  "/:id/deactivate",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getUserByIdValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().deactivateUser(req, res)
);

userRouter.patch(
  "/:id/activate",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getUserByIdValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().activateUser(req, res)
);

userRouter.get(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdminOrOwner,
  getUserByIdValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().getUserById(req, res)
);

userRouter.put(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdminOrOwner,
  updateUserValidation,
  handleValidationErrors,
  (req: Request, res: Response) => getUserController().updateUser(req, res)
);

export default userRouter;
