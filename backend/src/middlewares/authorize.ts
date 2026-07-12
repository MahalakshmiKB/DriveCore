import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Route guard factory. Usage:
 *   router.post('/vehicles', authenticate, authorize(['Fleet Manager']), controller.create)
 *
 * Must run AFTER `authenticate`, since it relies on req.user being set.
 */
export function authorize(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not permitted to perform this action`));
    }

    next();
  };
}
