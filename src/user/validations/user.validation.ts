import { body, param, query } from "express-validator";
import { UserRole } from "../models/userModel.js";

export const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),

  body("role")
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage("El rol debe ser 'admin' o 'user'"),
];

export const updateUserValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),

  body("role")
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage("El rol debe ser 'admin' o 'user'"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive debe ser un valor booleano"),
];

export const getUserByIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),
];

export const deleteUserValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido"),
];

export const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor a 0")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100")
    .toInt(),
];
