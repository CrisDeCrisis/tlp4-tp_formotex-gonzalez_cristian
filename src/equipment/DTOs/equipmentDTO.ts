import type {
  EquipmentStatus,
  EquipmentType,
} from "../models/equipment.model.js";
import type { Types } from "mongoose";

/**
 * DTO para crear un nuevo equipo
 */
export interface CreateEquipmentDto {
  name: string;
  type: EquipmentType;
  brand: string;
  modelName: string;
}

/**
 * DTO para actualizar un equipo
 */
export interface UpdateEquipmentDto {
  name?: string;
  type?: EquipmentType;
  brand?: string;
  modelName?: string;
  status?: EquipmentStatus;
  assignedTo?: Types.ObjectId | null;
  assignmentHistory?: Types.ObjectId[];
}

/**
 * DTO para la respuesta de un equipo
 */
export interface EquipmentResponseDto {
  id: string;
  name: string;
  type: EquipmentType;
  brand: string;
  modelName: string;
  status: EquipmentStatus;
  assignedTo?: Types.ObjectId | null;
  assignmentHistory?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para la lista de equipos
 */
export interface EquipmentListResponseDto {
  equipments: EquipmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * DTO para actualizar el estado de un equipo
 */
export interface UpdateEquipmentStatusDto {
  status: EquipmentStatus;
  notes?: string;
}
