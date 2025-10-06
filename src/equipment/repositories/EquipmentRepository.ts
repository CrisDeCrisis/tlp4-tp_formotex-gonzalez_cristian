import type {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "../DTOs/equipmentDTO.js";
import { Equipment } from "../entities/equipmentEntity.js";
import {
  EquipmentModel,
  type IEquipment,
  EquipmentStatus,
  EquipmentType,
} from "../models/equipment.model.js";
import type { IEquipmentRepository } from "../interfaces/IEquipmentRepository.js";

export class EquipmentRepository implements IEquipmentRepository {
  private mapToEntity(equipmentDoc: IEquipment & { _id: any }): Equipment {
    return Equipment.fromDatabase(
      equipmentDoc._id.toString(),
      equipmentDoc.name,
      equipmentDoc.type,
      equipmentDoc.brand,
      equipmentDoc.modelName,
      equipmentDoc.status,
      equipmentDoc.assignedTo,
      equipmentDoc.assignmentHistory,
      equipmentDoc.createdAt,
      equipmentDoc.updatedAt
    );
  }

  async create(equipmentData: CreateEquipmentDto): Promise<Equipment> {
    try {
      const newEquipmentDoc = await EquipmentModel.create({
        name: equipmentData.name,
        type: equipmentData.type,
        brand: equipmentData.brand,
        modelName: equipmentData.modelName,
      });

      const savedEquipmentDoc = await EquipmentModel.findById(
        newEquipmentDoc._id
      );
      if (!savedEquipmentDoc) {
        throw new Error("Error al crear el equipo");
      }

      return this.mapToEntity(savedEquipmentDoc);
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error}`);
    }
  }

  async findById(id: string): Promise<Equipment | null> {
    try {
      const equipmentDoc = await EquipmentModel.findById(id)
        .populate("assignedTo", "name email")
        .populate("assignmentHistory");

      if (!equipmentDoc) return null;
      return this.mapToEntity(equipmentDoc);
    } catch (error) {
      throw new Error(`Error al buscar equipo por ID: ${error}`);
    }
  }

  async findBySerialNumber(serialNumber: string): Promise<Equipment | null> {
    try {
      const equipmentDoc = await EquipmentModel.findOne({
        serialNumber: serialNumber.toUpperCase(),
      });

      if (!equipmentDoc) return null;
      return this.mapToEntity(equipmentDoc);
    } catch (error) {
      throw new Error(`Error al buscar equipo por número de serie: ${error}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Equipment[]> {
    try {
      const skip = (page - 1) * limit;
      const equipmentDocs = await EquipmentModel.find()
        .populate("assignedTo", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return equipmentDocs.map((doc) => this.mapToEntity(doc));
    } catch (error) {
      throw new Error(`Error al obtener equipos: ${error}`);
    }
  }

  async findByStatus(
    status: EquipmentStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<Equipment[]> {
    try {
      const skip = (page - 1) * limit;
      const equipmentDocs = await EquipmentModel.find({ status })
        .populate("assignedTo", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return equipmentDocs.map((doc) => this.mapToEntity(doc));
    } catch (error) {
      throw new Error(`Error al obtener equipos por estado: ${error}`);
    }
  }

  async findByType(
    type: EquipmentType,
    page: number = 1,
    limit: number = 10
  ): Promise<Equipment[]> {
    try {
      const skip = (page - 1) * limit;
      const equipmentDocs = await EquipmentModel.find({ type })
        .populate("assignedTo", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return equipmentDocs.map((doc) => this.mapToEntity(doc));
    } catch (error) {
      throw new Error(`Error al obtener equipos por tipo: ${error}`);
    }
  }

  async update(
    id: string,
    equipmentData: UpdateEquipmentDto
  ): Promise<Equipment | null> {
    try {
      const updateData: any = { ...equipmentData };

      const updatedEquipmentDoc = await EquipmentModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate("assignedTo", "name email");

      if (!updatedEquipmentDoc) return null;
      return this.mapToEntity(updatedEquipmentDoc);
    } catch (error) {
      throw new Error(`Error al actualizar equipo: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await EquipmentModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error al eliminar equipo: ${error}`);
    }
  }

  async count(): Promise<number> {
    try {
      return await EquipmentModel.countDocuments();
    } catch (error) {
      throw new Error(`Error al contar equipos: ${error}`);
    }
  }

  async countByStatus(status: EquipmentStatus): Promise<number> {
    try {
      return await EquipmentModel.countDocuments({ status });
    } catch (error) {
      throw new Error(`Error al contar equipos por estado: ${error}`);
    }
  }

  async countByType(type: EquipmentType): Promise<number> {
    try {
      return await EquipmentModel.countDocuments({ type });
    } catch (error) {
      throw new Error(`Error al contar equipos por tipo: ${error}`);
    }
  }

  async findByAssignedUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Equipment[]> {
    try {
      const skip = (page - 1) * limit;
      const equipments = await EquipmentModel.find({ assignedTo: userId })
        .skip(skip)
        .limit(limit)
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });

      return equipments.map((eq) => this.mapToEntity(eq));
    } catch (error) {
      throw new Error(
        `Error al obtener equipos por usuario asignado: ${error}`
      );
    }
  }

  async countByAssignedUser(userId: string): Promise<number> {
    try {
      return await EquipmentModel.countDocuments({ assignedTo: userId });
    } catch (error) {
      throw new Error(`Error al contar equipos por usuario asignado: ${error}`);
    }
  }
}
