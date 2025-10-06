import { Router, type Request, type Response } from "express";
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

equipmentRouter.post(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  createEquipmentValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().createEquipment(req, res)
);

equipmentRouter.post(
  "/assign",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  assignEquipmentValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().assignEquipment(req, res)
);

equipmentRouter.get(
  "/",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  paginationValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().getAllEquipments(req, res)
);

equipmentRouter.get(
  "/my-equipments",
  VerifyJWT.verifyToken,
  paginationValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().getMyEquipments(req, res)
);

equipmentRouter.get(
  "/my-equipments/:id",
  VerifyJWT.verifyToken,
  getMyEquipmentByIdValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().getMyEquipmentById(req, res)
);

equipmentRouter.get(
  "/status/:status",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getEquipmentsByStatusValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().getEquipmentsByStatus(req, res)
);

equipmentRouter.get(
  "/type/:type",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getEquipmentsByTypeValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().getEquipmentsByType(req, res)
);

equipmentRouter.get(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  getEquipmentByIdValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().getEquipmentById(req, res)
);

equipmentRouter.put(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  updateEquipmentValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().updateEquipment(req, res)
);

equipmentRouter.patch(
  "/:id/status",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  updateEquipmentStatusValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().updateEquipmentStatus(req, res)
);

equipmentRouter.patch(
  "/:id/return",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  returnEquipmentValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().returnEquipment(req, res)
);

equipmentRouter.delete(
  "/:id",
  VerifyJWT.verifyToken,
  VerifyRole.isAdmin,
  deleteEquipmentValidation,
  handleValidationErrors,
  (req: Request, res: Response) =>
    getEquipmentController().deleteEquipment(req, res)
);

export default equipmentRouter;
