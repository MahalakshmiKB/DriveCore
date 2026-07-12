import { NextFunction, Request, Response } from 'express';
import { vehiclesService } from './vehicles.service';
import { sendSuccess } from '../../utils/ApiResponse';

export const vehiclesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await vehiclesService.list(req.query as any);
      sendSuccess(res, result.items, 'Vehicles retrieved', 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  },

  async available(_req: Request, res: Response, next: NextFunction) {
    try {
      const vehicles = await vehiclesService.getAvailable();
      sendSuccess(res, vehicles, 'Available vehicles retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const vehicle = await vehiclesService.getById(id);
      sendSuccess(res, vehicle, 'Vehicle retrieved');
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehiclesService.create(req.body, req.user?.id);
      sendSuccess(res, vehicle, 'Vehicle created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const vehicle = await vehiclesService.update(id, req.body, req.user?.id);
      sendSuccess(res, vehicle, 'Vehicle updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async retire(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const vehicle = await vehiclesService.retire(id, req.user?.id);
      sendSuccess(res, vehicle, 'Vehicle retired successfully');
    } catch (err) {
      next(err);
    }
  },
};
