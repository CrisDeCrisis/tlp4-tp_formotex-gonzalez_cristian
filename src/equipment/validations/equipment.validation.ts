import { body, param, query } from "express-validator";
import { EquipmentStatus, EquipmentType } from "../models/equipment.model.js";

export const createEquipmentValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del equipo es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("type")
    .notEmpty()
    .withMessage("El tipo de equipo es obligatorio")
    .isIn(Object.values(EquipmentType))
    .withMessage("El tipo de equipo no es válido"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("La marca es obligatoria")
    .isLength({ min: 2, max: 50 })
    .withMessage("La marca debe tener entre 2 y 50 caracteres"),

  body("modelName")
    .trim()
    .notEmpty()
    .withMessage("El modelo es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El modelo debe tener entre 2 y 50 caracteres"),
];

export const updateEquipmentValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("type")
    .optional()
    .isIn(Object.values(EquipmentType))
    .withMessage("El tipo de equipo no es válido"),

  body("brand")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La marca no puede estar vacía")
    .isLength({ min: 2, max: 50 })
    .withMessage("La marca debe tener entre 2 y 50 caracteres"),

  body("modelName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El modelo no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El modelo debe tener entre 2 y 50 caracteres"),

  body("status")
    .optional()
    .isIn(Object.values(EquipmentStatus))
    .withMessage("El estado del equipo no es válido"),
];

export const updateEquipmentStatusValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),

  body("status")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(Object.values(EquipmentStatus))
    .withMessage("El estado del equipo no es válido"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder los 500 caracteres"),
];

export const getEquipmentByIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),
];

export const deleteEquipmentValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),
];

export const getEquipmentsByStatusValidation = [
  param("status")
    .trim()
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(Object.values(EquipmentStatus))
    .withMessage("El estado del equipo no es válido"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El número de página debe ser un entero mayor a 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un entero entre 1 y 100"),
];

export const getEquipmentsByTypeValidation = [
  param("type")
    .trim()
    .notEmpty()
    .withMessage("El tipo es obligatorio")
    .isIn(Object.values(EquipmentType))
    .withMessage("El tipo de equipo no es válido"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El número de página debe ser un entero mayor a 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un entero entre 1 y 100"),
];

export const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El número de página debe ser un entero mayor a 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un entero entre 1 y 100"),
];

export const getMyEquipmentByIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),
];

export const assignEquipmentValidation = [
  body("equipmentId")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID del equipo no es válido"),

  body("userId")
    .trim()
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio")
    .isMongoId()
    .withMessage("El ID del usuario no es válido"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder los 500 caracteres"),
];

export const returnEquipmentValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del equipo es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),

  body("returnNotes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Las notas de devolución no pueden exceder los 500 caracteres"
    ),
];
