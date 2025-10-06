import type { IObserver } from "../interfaces/IObserver.js";
import type { EquipmentStatus } from "../models/equipment.model.js";

export class AdminNotifierObserver implements IObserver {
  update(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║          NOTIFICACIÓN DE CAMBIO DE ESTADO                 ║
╠═══════════════════════════════════════════════════════════╣
║ Equipo: ${equipmentName.padEnd(48, " ")}║
║ ID: ${equipmentId.padEnd(52, " ")}║
║ Estado anterior: ${oldStatus.padEnd(42, " ")}║
║ Estado nuevo: ${newStatus.padEnd(45, " ")}║
║ Fecha: ${new Date().toLocaleString("es-AR").padEnd(49, " ")}║
╚═══════════════════════════════════════════════════════════╝
    `);
  }
}
