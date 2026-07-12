import { NextFunction, Request, Response } from 'express';
import { driversService } from './drivers.service';
import { sendSuccess } from '../../utils/ApiResponse';

export const driversController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await driversService.list(req.query as any);
      sendSuccess(res, result.items, 'Drivers retrieved', 200, {
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
      const drivers = await driversService.getAvailable();
      sendSuccess(res, drivers, 'Available drivers retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const driver = await driversService.getById(id);
      sendSuccess(res, driver, 'Driver retrieved');
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const driver = await driversService.create(req.body, req.user?.id);
      sendSuccess(res, driver, 'Driver created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const driver = await driversService.update(id, req.body, req.user?.id);
      sendSuccess(res, driver, 'Driver updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async suspend(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const driver = await driversService.suspend(id, req.user?.id);
      sendSuccess(res, driver, 'Driver suspended successfully');
    } catch (err) {
      next(err);
    }
  },
};
