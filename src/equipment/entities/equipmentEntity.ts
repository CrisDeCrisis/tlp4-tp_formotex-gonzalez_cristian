import { EquipmentStatus, EquipmentType } from "../models/equipment.model.js";
import type { Types } from "mongoose";

export class Equipment {
  constructor(
    public id: string,
    public name: string,
    public type: EquipmentType,
    public brand: string,
    public modelName: string,
    public status: EquipmentStatus = EquipmentStatus.AVAILABLE,
    public assignedTo?: Types.ObjectId | null,
    public assignmentHistory: Types.ObjectId[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public static create(
    name: string,
    type: EquipmentType,
    brand: string,
    modelName: string
  ) {
    const equipmentData: any = {
      name,
      type,
      brand,
      modelName,
      status: EquipmentStatus.AVAILABLE,
      assignedTo: null,
      assignmentHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return equipmentData;
  }

  public static fromDatabase(
    id: string,
    name: string,
    type: EquipmentType,
    brand: string,
    modelName: string,
    status: EquipmentStatus,
    assignedTo: Types.ObjectId | null | undefined,
    assignmentHistory: Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
  ): Equipment {
    return new Equipment(
      id,
      name,
      type,
      brand,
      modelName,
      status,
      assignedTo || null,
      assignmentHistory || [],
      createdAt,
      updatedAt
    );
  }

  public isAvailable(): boolean {
    return this.status === EquipmentStatus.AVAILABLE;
  }

  public isAssigned(): boolean {
    return this.status === EquipmentStatus.ASSIGNED;
  }

  public isInMaintenance(): boolean {
    return this.status === EquipmentStatus.MAINTENANCE;
  }

  public getBasicInfo(): {
    id: string;
    name: string;
    type: EquipmentType;
    status: EquipmentStatus;
  } {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
    };
  }
}
