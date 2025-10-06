import { EquipmentType } from "../models/equipment.model.js";

export interface EquipmentCreationData {
  name: string;
  brand: string;
  modelName: string;
}

export abstract class EquipmentFactory {
  abstract createEquipment(data: EquipmentCreationData): {
    name: string;
    type: EquipmentType;
    brand: string;
    modelName: string;
  };

  public create(data: EquipmentCreationData) {
    this.validateData(data);
    return this.createEquipment(data);
  }

  protected validateData(data: EquipmentCreationData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("El nombre del equipo es obligatorio");
    }
    if (!data.brand || data.brand.trim().length === 0) {
      throw new Error("La marca es obligatoria");
    }
    if (!data.modelName || data.modelName.trim().length === 0) {
      throw new Error("El modelo es obligatorio");
    }
  }
}

export class LaptopFactory extends EquipmentFactory {
  createEquipment(data: EquipmentCreationData) {
    return {
      ...data,
      type: EquipmentType.LAPTOP,
    };
  }
}

export class MonitorFactory extends EquipmentFactory {
  createEquipment(data: EquipmentCreationData) {
    return {
      ...data,
      type: EquipmentType.MONITOR,
    };
  }
}

export class PrinterFactory extends EquipmentFactory {
  createEquipment(data: EquipmentCreationData) {
    return {
      ...data,
      type: EquipmentType.PRINTER,
    };
  }
}

export class EquipmentFactoryManager {
  private static factories = new Map<EquipmentType, EquipmentFactory>([
    [EquipmentType.LAPTOP, new LaptopFactory()],
    [EquipmentType.MONITOR, new MonitorFactory()],
    [EquipmentType.PRINTER, new PrinterFactory()],
  ]);

  static getFactory(type: EquipmentType): EquipmentFactory {
    const factory = this.factories.get(type);
    if (!factory) {
      throw new Error(`No existe un factory para el tipo de equipo: ${type}`);
    }
    return factory;
  }

  static createEquipment(type: EquipmentType, data: EquipmentCreationData) {
    const factory = this.getFactory(type);
    return factory.create(data);
  }
}
