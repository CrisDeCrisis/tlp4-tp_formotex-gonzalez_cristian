import type {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentResponseDto,
  EquipmentListResponseDto,
} from "./DTOs/equipmentDTO.js";
import type { Equipment } from "./entities/equipmentEntity.js";
import type { IEquipmentRepository } from "./interfaces/IEquipmentRepository.js";
import type { IEquipmentService } from "./interfaces/IEquipmentService.js";
import type { IObserver, ISubject } from "./interfaces/IObserver.js";
import { EquipmentStatus, EquipmentType } from "./models/equipment.model.js";
import {
  AssignmentModel,
  AssignmentStatus,
} from "./models/assignment.model.js";
import { EquipmentFactoryManager } from "./factories/EquipmentFactory.js";

export class EquipmentService implements IEquipmentService, ISubject {
  private observers: IObserver[] = [];

  constructor(private equipmentRepository: IEquipmentRepository) {}

  attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log("Observer ya existe");
      return;
    }
    this.observers.push(observer);
    console.log(`Observer adjuntado. Total: ${this.observers.length}`);
  }

  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log("Observer no existe");
      return;
    }
    this.observers.splice(observerIndex, 1);
    console.log(`Observer removido. Total: ${this.observers.length}`);
  }

  notify(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void {
    console.log(`\nNotificando a ${this.observers.length} observadores...`);
    for (const observer of this.observers) {
      observer.update(equipmentId, oldStatus, newStatus, equipmentName);
    }
  }

  private mapToResponse(equipment: Equipment): EquipmentResponseDto {
    const response: EquipmentResponseDto = {
      id: equipment.id,
      name: equipment.name,
      type: equipment.type,
      brand: equipment.brand,
      modelName: equipment.modelName,
      status: equipment.status,
      assignedTo: equipment.assignedTo || null,
      assignmentHistory: equipment.assignmentHistory,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt,
    };

    return response;
  }

  async createEquipment(
    equipmentData: CreateEquipmentDto
  ): Promise<EquipmentResponseDto> {
    try {
      const factoryData: any = {
        name: equipmentData.name,
        brand: equipmentData.brand,
        modelName: equipmentData.modelName,
      };

      const equipmentFromFactory = EquipmentFactoryManager.createEquipment(
        equipmentData.type,
        factoryData
      );

      const newEquipment = await this.equipmentRepository.create(
        equipmentFromFactory
      );

      return this.mapToResponse(newEquipment);
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error}`);
    }
  }

  async getEquipmentById(id: string): Promise<EquipmentResponseDto | null> {
    try {
      const equipment = await this.equipmentRepository.findById(id);
      if (!equipment) return null;
      return this.mapToResponse(equipment);
    } catch (error) {
      throw new Error(`Error al obtener equipo: ${error}`);
    }
  }

  async getAllEquipments(
    page: number = 1,
    limit: number = 10
  ): Promise<EquipmentListResponseDto> {
    try {
      const equipments = await this.equipmentRepository.findAll(page, limit);
      const total = await this.equipmentRepository.count();

      return {
        equipments: equipments.map((eq) => this.mapToResponse(eq)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error al obtener equipos: ${error}`);
    }
  }

  async updateEquipment(
    id: string,
    equipmentData: UpdateEquipmentDto
  ): Promise<EquipmentResponseDto | null> {
    try {
      const equipment = await this.equipmentRepository.findById(id);
      if (!equipment) {
        throw new Error("Equipo no encontrado");
      }

      const updatedEquipment = await this.equipmentRepository.update(
        id,
        equipmentData
      );
      if (!updatedEquipment) return null;

      return this.mapToResponse(updatedEquipment);
    } catch (error) {
      throw new Error(`Error al actualizar equipo: ${error}`);
    }
  }

  async deleteEquipment(id: string): Promise<boolean> {
    try {
      const equipment = await this.equipmentRepository.findById(id);
      if (!equipment) {
        throw new Error("Equipo no encontrado");
      }

      // Verificar que el equipo no esté asignado
      if (equipment.status === EquipmentStatus.ASSIGNED) {
        throw new Error("No se puede eliminar un equipo que está asignado");
      }

      return await this.equipmentRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar equipo: ${error}`);
    }
  }

  /**
   * Actualiza el estado de un equipo y notifica a los observadores
   * Este es el método clave donde se aplica el patrón Observer
   */
  async updateEquipmentStatus(
    id: string,
    status: string
  ): Promise<EquipmentResponseDto | null> {
    try {
      const equipment = await this.equipmentRepository.findById(id);
      if (!equipment) {
        throw new Error("Equipo no encontrado");
      }

      const newStatus = status as EquipmentStatus;
      const oldStatus = equipment.status;

      this.validateStatusTransition(oldStatus, newStatus);
      const updatedEquipment = await this.equipmentRepository.update(id, {
        status: newStatus,
      });

      if (!updatedEquipment) return null;

      this.notify(id, oldStatus, newStatus, equipment.name);

      return this.mapToResponse(updatedEquipment);
    } catch (error) {
      throw new Error(`Error al actualizar estado del equipo: ${error}`);
    }
  }

  private validateStatusTransition(
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus
  ): void {
    if (
      oldStatus === EquipmentStatus.ASSIGNED &&
      newStatus === EquipmentStatus.ASSIGNED
    ) {
      throw new Error("El equipo ya está asignado");
    }
  }

  async getEquipmentsByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<EquipmentListResponseDto> {
    try {
      const equipmentStatus = status as EquipmentStatus;
      const equipments = await this.equipmentRepository.findByStatus(
        equipmentStatus,
        page,
        limit
      );
      const total = await this.equipmentRepository.countByStatus(
        equipmentStatus
      );

      return {
        equipments: equipments.map((eq) => this.mapToResponse(eq)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error al obtener equipos por estado: ${error}`);
    }
  }

  async getEquipmentsByType(
    type: string,
    page: number = 1,
    limit: number = 10
  ): Promise<EquipmentListResponseDto> {
    try {
      const equipmentType = type as EquipmentType;
      const equipments = await this.equipmentRepository.findByType(
        equipmentType,
        page,
        limit
      );
      const total = await this.equipmentRepository.countByType(equipmentType);

      return {
        equipments: equipments.map((eq) => this.mapToResponse(eq)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error al obtener equipos por tipo: ${error}`);
    }
  }

  async assignEquipmentToUser(
    equipmentId: string,
    userId: string,
    assignedBy: string,
    notes?: string
  ): Promise<EquipmentResponseDto> {
    try {
      const equipment = await this.equipmentRepository.findById(equipmentId);
      if (!equipment) {
        throw new Error("Equipo no encontrado");
      }

      if (!equipment.isAvailable()) {
        throw new Error("El equipo no está disponible para asignación");
      }

      const assignment = await AssignmentModel.create({
        equipment: equipmentId,
        user: userId,
        assignedBy: assignedBy,
        notes: notes,
        status: AssignmentStatus.ACTIVE,
      });

      const oldStatus = equipment.status;
      const updatedEquipment = await this.equipmentRepository.update(
        equipmentId,
        {
          status: EquipmentStatus.ASSIGNED,
          assignedTo: userId as any,
        }
      );

      if (!updatedEquipment) {
        throw new Error("Error al actualizar el equipo");
      }

      await this.equipmentRepository.update(equipmentId, {
        assignmentHistory: [...equipment.assignmentHistory, assignment._id],
      } as any);

      this.notify(
        equipmentId,
        oldStatus,
        EquipmentStatus.ASSIGNED,
        equipment.name
      );

      return this.mapToResponse(updatedEquipment);
    } catch (error) {
      throw new Error(`Error al asignar equipo: ${error}`);
    }
  }

  async returnEquipment(
    equipmentId: string,
    returnNotes?: string
  ): Promise<EquipmentResponseDto> {
    try {
      const equipment = await this.equipmentRepository.findById(equipmentId);
      if (!equipment) {
        throw new Error("Equipo no encontrado");
      }

      if (!equipment.isAssigned()) {
        throw new Error("El equipo no está asignado");
      }

      const activeAssignment = await AssignmentModel.findOne({
        equipment: equipmentId,
        status: AssignmentStatus.ACTIVE,
      });

      if (activeAssignment) {
        activeAssignment.status = AssignmentStatus.RETURNED;
        activeAssignment.returnDate = new Date();
        if (returnNotes !== undefined) {
          activeAssignment.returnNotes = returnNotes;
        }
        await activeAssignment.save();
      }

      const oldStatus = equipment.status;
      const updatedEquipment = await this.equipmentRepository.update(
        equipmentId,
        {
          status: EquipmentStatus.AVAILABLE,
          assignedTo: null,
        }
      );

      if (!updatedEquipment) {
        throw new Error("Error al actualizar el equipo");
      }

      this.notify(
        equipmentId,
        oldStatus,
        EquipmentStatus.AVAILABLE,
        equipment.name
      );

      return this.mapToResponse(updatedEquipment);
    } catch (error) {
      throw new Error(`Error al devolver equipo: ${error}`);
    }
  }

  async getMyEquipments(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<EquipmentListResponseDto> {
    try {
      const equipments = await this.equipmentRepository.findByAssignedUser(
        userId,
        page,
        limit
      );
      const total = await this.equipmentRepository.countByAssignedUser(userId);
      const totalPages = Math.ceil(total / limit);

      return {
        equipments: equipments.map((eq) => this.mapToResponse(eq)),
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      throw new Error(`Error al obtener mis equipos: ${error}`);
    }
  }

  async getMyEquipmentById(
    equipmentId: string,
    userId: string
  ): Promise<EquipmentResponseDto | null> {
    try {
      const equipment = await this.equipmentRepository.findById(equipmentId);

      if (!equipment) {
        return null;
      }

      if (!equipment.assignedTo || equipment.assignedTo.toString() !== userId) {
        throw new Error(
          "No tienes permiso para ver este equipo. Solo puedes ver equipos asignados a ti."
        );
      }

      return this.mapToResponse(equipment);
    } catch (error) {
      throw new Error(`Error al obtener mi equipo: ${error}`);
    }
  }
}
