import type {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "../DTOs/equipmentDTO.js";
import type { Equipment } from "../entities/equipmentEntity.js";
import type {
  EquipmentStatus,
  EquipmentType,
} from "../models/equipment.model.js";

export interface IEquipmentRepository {
  create(equipmentData: CreateEquipmentDto): Promise<Equipment>;
  findById(id: string): Promise<Equipment | null>;
  findBySerialNumber(serialNumber: string): Promise<Equipment | null>;
  findAll(page?: number, limit?: number): Promise<Equipment[]>;
  findByStatus(
    status: EquipmentStatus,
    page?: number,
    limit?: number
  ): Promise<Equipment[]>;
  findByType(
    type: EquipmentType,
    page?: number,
    limit?: number
  ): Promise<Equipment[]>;
  findByAssignedUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<Equipment[]>;
  update(
    id: string,
    equipmentData: UpdateEquipmentDto
  ): Promise<Equipment | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  countByStatus(status: EquipmentStatus): Promise<number>;
  countByType(type: EquipmentType): Promise<number>;
  countByAssignedUser(userId: string): Promise<number>;
}
