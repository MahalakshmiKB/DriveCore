import { NextFunction, Request, Response } from 'express';
import { tripsService } from './trips.service';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export const tripsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await tripsService.list(req.query as any);
      sendSuccess(res, result.items, 'Trips retrieved', 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const trip = await tripsService.getById(id);
      sendSuccess(res, trip, 'Trip retrieved');
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) throw ApiError.unauthorized('Authentication required');
      const trip = await tripsService.create(req.body, req.user.id);
      sendSuccess(res, trip, 'Trip created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const trip = await tripsService.update(id, req.body, req.user?.id);
      sendSuccess(res, trip, 'Trip updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async dispatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const trip = await tripsService.dispatch(id, req.user?.id);
      sendSuccess(res, trip, 'Trip dispatched successfully');
    } catch (err) {
      next(err);
    }
  },

  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const trip = await tripsService.complete(id, req.body, req.user?.id);
      sendSuccess(res, trip, 'Trip completed successfully');
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as unknown as { id: number };
      const trip = await tripsService.cancel(id, req.user?.id);
      sendSuccess(res, trip, 'Trip cancelled successfully');
    } catch (err) {
      next(err);
    }
  },
};
