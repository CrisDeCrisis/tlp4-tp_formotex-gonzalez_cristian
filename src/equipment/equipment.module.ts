import { Router } from "express";
import { VerifyJWT } from "../middlewares/verifyJWT.js";
import { VerifyRole } from "../middlewares/verifyRole.js";
import {
  createEquipmentValidation,
  updateEquipmentValidation,
  updateEquipmentStatusValidation,
  getEquipmentByIdValidation,
  deleteEquipmentValidation,
  getEquipmentsByStatusValidation,
  getEquipmentsByTypeValidation,
  paginationValidation,
  getMyEquipmentByIdValidation,
  assignEquipmentValidation,
  returnEquipmentValidation,
} from "./validations/equipment.validation.js";
import { handleValidationErrors } from "../helpers/handleValidationErrors.js";
import { getEquipmentController } from "../configs/dependencies.config.js";

const equipmentRouter = Router();

const equipmentController = getEquipmentController();

equipmentRouter.post(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  createEquipmentValidation,
  handleValidationErrors,
  equipmentController.createEquipment
);

equipmentRouter.post(
  "/assign",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  assignEquipmentValidation,
  handleValidationErrors,
  equipmentController.assignEquipment
);

equipmentRouter.get(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  paginationValidation,
  handleValidationErrors,
  equipmentController.getAllEquipments
);

equipmentRouter.get(
  "/my-equipments",
  VerifyJWT.verifyToken,
  paginationValidation,
  handleValidationErrors,
  equipmentController.getMyEquipments
);

equipmentRouter.get(
  "/my-equipments/:id",
  VerifyJWT.verifyToken,
  getMyEquipmentByIdValidation,
  handleValidationErrors,
  equipmentController.getMyEquipmentById
);

equipmentRouter.get(
  "/status/:status",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getEquipmentsByStatusValidation,
  handleValidationErrors,
  equipmentController.getEquipmentsByStatus
);

equipmentRouter.get(
  "/type/:type",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getEquipmentsByTypeValidation,
  handleValidationErrors,
  equipmentController.getEquipmentsByType
);

equipmentRouter.get(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getEquipmentByIdValidation,
  handleValidationErrors,
  equipmentController.getEquipmentById
);

equipmentRouter.put(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  updateEquipmentValidation,
  handleValidationErrors,
  equipmentController.updateEquipment
);

equipmentRouter.patch(
  "/:id/status",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  updateEquipmentStatusValidation,
  handleValidationErrors,
  equipmentController.updateEquipmentStatus
);

equipmentRouter.patch(
  "/:id/return",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  returnEquipmentValidation,
  handleValidationErrors,
  equipmentController.returnEquipment
);

equipmentRouter.delete(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  deleteEquipmentValidation,
  handleValidationErrors,
  equipmentController.deleteEquipment
);

export default equipmentRouter;
