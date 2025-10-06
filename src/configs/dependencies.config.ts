import { container } from "../middlewares/dependencyInyection.js";

import { UserRepository } from "../user/repositories/UserRepository.js";
import { EquipmentRepository } from "../equipment/repositories/EquipmentRepository.js";

import { UserService } from "../user/user.service.js";
import { AuthService } from "../auth/auth.service.js";
import { EquipmentService } from "../equipment/equipment.service.js";

import { AuthCtrl } from "../auth/auth.controller.js";
import { UserController } from "../user/user.controller.js";
import { EquipmentController } from "../equipment/equipment.controller.js";

import { AdminNotifierObserver } from "../equipment/observers/AdminNotifierObserver.js";
import { HistoryLoggerObserver } from "../equipment/observers/HistoryLoggerObserver.js";

export const TOKENS = {
  UserRepository: "UserRepository",
  EquipmentRepository: "EquipmentRepository",

  UserService: "UserService",
  AuthService: "AuthService",
  EquipmentService: "EquipmentService",

  AuthController: "AuthController",
  UserController: "UserController",
  EquipmentController: "EquipmentController",

  AdminNotifierObserver: "AdminNotifierObserver",
  HistoryLoggerObserver: "HistoryLoggerObserver",
};

export function initializeDependencies(): void {
  const userRepository = new UserRepository();
  container.registerInstance(TOKENS.UserRepository, userRepository);

  const equipmentRepository = new EquipmentRepository();
  container.registerInstance(TOKENS.EquipmentRepository, equipmentRepository);

  const adminNotifier = new AdminNotifierObserver();
  container.registerInstance(TOKENS.AdminNotifierObserver, adminNotifier);

  const historyLogger = new HistoryLoggerObserver();
  container.registerInstance(TOKENS.HistoryLoggerObserver, historyLogger);

  const userService = new UserService(userRepository);
  container.registerInstance(TOKENS.UserService, userService);

  const authService = new AuthService(userService);
  container.registerInstance(TOKENS.AuthService, authService);

  const equipmentService = new EquipmentService(equipmentRepository);
  equipmentService.attach(adminNotifier);
  equipmentService.attach(historyLogger);
  container.registerInstance(TOKENS.EquipmentService, equipmentService);

  const authController = new AuthCtrl(authService);
  container.registerInstance(TOKENS.AuthController, authController);

  const userController = new UserController(userService);
  container.registerInstance(TOKENS.UserController, userController);

  const equipmentController = new EquipmentController(equipmentService);
  container.registerInstance(TOKENS.EquipmentController, equipmentController);

  console.log("✅ Dependencias inicializadas correctamente");
}

export function getAuthController(): AuthCtrl {
  return container.resolve(TOKENS.AuthController);
}

export function getUserController(): UserController {
  return container.resolve(TOKENS.UserController);
}

export function getEquipmentController(): EquipmentController {
  return container.resolve(TOKENS.EquipmentController);
}

export function getUserService(): UserService {
  return container.resolve(TOKENS.UserService);
}

export function getEquipmentService(): EquipmentService {
  return container.resolve(TOKENS.EquipmentService);
}
