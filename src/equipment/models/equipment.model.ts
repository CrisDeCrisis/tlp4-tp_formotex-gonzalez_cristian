import { Schema, model, type Document, type Types } from "mongoose";

export enum EquipmentStatus {
  AVAILABLE = "available",
  ASSIGNED = "assigned",
  MAINTENANCE = "maintenance",
}

export enum EquipmentType {
  LAPTOP = "laptop",
  MONITOR = "monitor",
  PRINTER = "printer",
}

export interface IEquipment extends Document {
  name: string;
  type: EquipmentType;
  brand: string;
  modelName: string;
  status: EquipmentStatus;
  assignedTo?: Types.ObjectId;
  assignmentHistory: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const equipmentSchema = new Schema<IEquipment>(
  {
    name: {
      type: String,
      required: [true, "El nombre del equipo es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    type: {
      type: String,
      enum: Object.values(EquipmentType),
      required: [true, "El tipo de equipo es obligatorio"],
    },
    brand: {
      type: String,
      required: [true, "La marca es obligatoria"],
      trim: true,
      maxlength: [50, "La marca no puede exceder los 50 caracteres"],
    },
    modelName: {
      type: String,
      required: [true, "El modelo es obligatorio"],
      trim: true,
      maxlength: [50, "El modelo no puede exceder los 50 caracteres"],
    },
    status: {
      type: String,
      enum: Object.values(EquipmentStatus),
      default: EquipmentStatus.AVAILABLE,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignmentHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

equipmentSchema.index({ status: 1 });
equipmentSchema.index({ type: 1 });
equipmentSchema.index({ assignedTo: 1 });

export const EquipmentModel = model<IEquipment>("Equipment", equipmentSchema);
