import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { VerifyJWT } from "../middlewares/verifyJWT.js";
import { VerifyRole } from "../middlewares/verifyRole.js";

const userRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Ruta pública - Solo para obtener el perfil del usuario autenticado
userRouter.get("/profile", VerifyJWT.verifyToken, userController.getProfile);

// Rutas protegidas solo para ADMINISTRADORES
userRouter.post(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  userController.createUser
);

userRouter.get(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  userController.getAllUsers
);

userRouter.delete(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  userController.deleteUser
);

userRouter.patch(
  "/:id/deactivate",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  userController.deactivateUser
);

userRouter.patch(
  "/:id/activate",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  userController.activateUser
);

// Rutas que pueden acceder ADMIN o el propio usuario
userRouter.get(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdminOrOwner,
  userController.getUserById
);

userRouter.put(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdminOrOwner,
  userController.updateUser
);

export default userRouter;
