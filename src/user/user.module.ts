import { Router } from "express";
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

const userController = getUserController();

userRouter.get("/profile", VerifyJWT.verifyToken, userController.getProfile);

userRouter.patch(
  "/:id/promote",
  VerifyJWT.verifyToken,
  VerifyRole.isSuperAdmin,
  getUserByIdValidation,
  handleValidationErrors,
  userController.promoteToAdmin
);

userRouter.post(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  createUserValidation,
  handleValidationErrors,
  userController.createUser
);

userRouter.get(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  paginationValidation,
  handleValidationErrors,
  userController.getAllUsers
);

userRouter.delete(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  deleteUserValidation,
  handleValidationErrors,
  userController.deleteUser
);

userRouter.patch(
  "/:id/deactivate",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getUserByIdValidation,
  handleValidationErrors,
  userController.deactivateUser
);

userRouter.patch(
  "/:id/activate",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getUserByIdValidation,
  handleValidationErrors,
  userController.activateUser
);

userRouter.get(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdminOrOwner,
  getUserByIdValidation,
  handleValidationErrors,
  userController.getUserById
);

userRouter.put(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdminOrOwner,
  updateUserValidation,
  handleValidationErrors,
  userController.updateUser
);

export default userRouter;
