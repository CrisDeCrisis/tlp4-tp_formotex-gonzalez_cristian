import { EquipmentStatus } from "../models/equipment.model.js";

// Interfaz para los observadores
export interface IObserver {
  update(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void;
}

// Interfaz para el sujeto observable
export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void;
}
