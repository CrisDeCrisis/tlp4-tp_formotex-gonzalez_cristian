import type { Request, Response } from "express";
import type { IEquipmentService } from "./interfaces/IEquipmentService.js";
import type {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  UpdateEquipmentStatusDto,
} from "./DTOs/equipmentDTO.js";

export class EquipmentController {
  constructor(private equipmentService: IEquipmentService) {}

  public createEquipment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const equipmentData: CreateEquipmentDto = req.body;
      const newEquipment = await this.equipmentService.createEquipment(
        equipmentData
      );

      return res.status(201).json({
        success: true,
        message: "Equipo creado exitosamente",
        data: newEquipment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al crear equipo",
      });
    }
  };

  public getEquipmentById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const equipment = await this.equipmentService.getEquipmentById(id!);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        data: equipment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al obtener equipo",
      });
    }
  };

  public getAllEquipments = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.equipmentService.getAllEquipments(page, limit);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al obtener equipos",
      });
    }
  };

  public updateEquipment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const equipmentData: UpdateEquipmentDto = req.body;

      const updatedEquipment = await this.equipmentService.updateEquipment(
        id!,
        equipmentData
      );

      if (!updatedEquipment) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipo actualizado exitosamente",
        data: updatedEquipment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al actualizar equipo",
      });
    }
  };

  public deleteEquipment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;

      const deleted = await this.equipmentService.deleteEquipment(id!);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipo eliminado exitosamente",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al eliminar equipo",
      });
    }
  };

  public updateEquipmentStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const { status } = req.body as UpdateEquipmentStatusDto;

      const updatedEquipment =
        await this.equipmentService.updateEquipmentStatus(id!, status);

      if (!updatedEquipment) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Estado del equipo actualizado exitosamente",
        data: updatedEquipment,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar estado del equipo",
      });
    }
  };

  public getEquipmentsByStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { status } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.equipmentService.getEquipmentsByStatus(
        status!,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener equipos por estado",
      });
    }
  };

  public getEquipmentsByType = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.equipmentService.getEquipmentsByType(
        type!,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener equipos por tipo",
      });
    }
  };

  public assignEquipment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { equipmentId, userId, notes } = req.body;
      const assignedBy = req.user?.id;

      if (!assignedBy) {
        return res.status(401).json({
          success: false,
          message: "No autorizado",
        });
      }

      const result = await this.equipmentService.assignEquipmentToUser(
        equipmentId,
        userId,
        assignedBy,
        notes
      );

      return res.status(200).json({
        success: true,
        message: "Equipo asignado exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al asignar equipo",
      });
    }
  };

  public returnEquipment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const { returnNotes } = req.body;

      const result = await this.equipmentService.returnEquipment(
        id!,
        returnNotes
      );

      return res.status(200).json({
        success: true,
        message: "Equipo devuelto exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al devolver equipo",
      });
    }
  };

  public getMyEquipments = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "No autorizado",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.equipmentService.getMyEquipments(
        userId,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        message: "Equipos asignados obtenidos exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener mis equipos",
      });
    }
  };

  public getMyEquipmentById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "No autorizado",
        });
      }

      const equipment = await this.equipmentService.getMyEquipmentById(
        id!,
        userId
      );

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado o no asignado a ti",
        });
      }

      return res.status(200).json({
        success: true,
        data: equipment,
      });
    } catch (error) {
      return res.status(403).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al obtener el equipo",
      });
    }
  };
}
