import { Schema, model, type Document, type Types } from "mongoose";

export enum AssignmentStatus {
  ACTIVE = "active",
  RETURNED = "returned",
  CANCELLED = "cancelled",
}

export interface IAssignment extends Document {
  equipment: Types.ObjectId;
  user: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignmentDate: Date;
  returnDate?: Date;
  expectedReturnDate?: Date;
  status: AssignmentStatus;
  notes?: string;
  returnNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
      required: [true, "El equipo es obligatorio"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El administrador asignador es obligatorio"],
    },
    assignmentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    expectedReturnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(AssignmentStatus),
      default: AssignmentStatus.ACTIVE,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Las notas no pueden exceder los 500 caracteres"],
    },
    returnNotes: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "Las notas de devolución no pueden exceder los 500 caracteres",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

assignmentSchema.index({ equipment: 1, status: 1 });
assignmentSchema.index({ user: 1, status: 1 });
assignmentSchema.index({ assignmentDate: -1 });

export const AssignmentModel = model<IAssignment>(
  "Assignment",
  assignmentSchema
);
