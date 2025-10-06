import type { IObserver } from "../interfaces/IObserver.js";
import type { EquipmentStatus } from "../models/equipment.model.js";

export class HistoryLoggerObserver implements IObserver {
  private logs: Array<{
    equipmentId: string;
    equipmentName: string;
    oldStatus: EquipmentStatus;
    newStatus: EquipmentStatus;
    timestamp: Date;
  }> = [];

  update(
    equipmentId: string,
    oldStatus: EquipmentStatus,
    newStatus: EquipmentStatus,
    equipmentName: string
  ): void {
    const logEntry = {
      equipmentId,
      equipmentName,
      oldStatus,
      newStatus,
      timestamp: new Date(),
    };

    this.logs.push(logEntry);

    console.log(
      `[HISTORY LOG] ${logEntry.timestamp.toISOString()} - Equipment "${equipmentName}" (${equipmentId}): ${oldStatus} → ${newStatus}`
    );
  }

  getLogs() {
    return this.logs;
  }

  getLogsByEquipment(equipmentId: string) {
    return this.logs.filter((log) => log.equipmentId === equipmentId);
  }

  clearLogs() {
    this.logs = [];
  }
}
