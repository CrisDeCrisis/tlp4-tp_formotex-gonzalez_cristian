import type {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentResponseDto,
  EquipmentListResponseDto,
} from "../DTOs/equipmentDTO.js";

export interface IEquipmentService {
  createEquipment(
    equipmentData: CreateEquipmentDto
  ): Promise<EquipmentResponseDto>;
  getEquipmentById(id: string): Promise<EquipmentResponseDto | null>;
  getAllEquipments(
    page?: number,
    limit?: number
  ): Promise<EquipmentListResponseDto>;
  updateEquipment(
    id: string,
    equipmentData: UpdateEquipmentDto
  ): Promise<EquipmentResponseDto | null>;
  deleteEquipment(id: string): Promise<boolean>;
  updateEquipmentStatus(
    id: string,
    status: string
  ): Promise<EquipmentResponseDto | null>;
  getEquipmentsByStatus(
    status: string,
    page?: number,
    limit?: number
  ): Promise<EquipmentListResponseDto>;
  getEquipmentsByType(
    type: string,
    page?: number,
    limit?: number
  ): Promise<EquipmentListResponseDto>;
  assignEquipmentToUser(
    equipmentId: string,
    userId: string,
    assignedBy: string,
    notes?: string
  ): Promise<EquipmentResponseDto>;
  returnEquipment(
    equipmentId: string,
    returnNotes?: string
  ): Promise<EquipmentResponseDto>;
  getMyEquipments(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<EquipmentListResponseDto>;
  getMyEquipmentById(
    equipmentId: string,
    userId: string
  ): Promise<EquipmentResponseDto | null>;
}
