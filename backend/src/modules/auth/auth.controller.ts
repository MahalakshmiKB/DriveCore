import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: `${env.API_PREFIX}/auth`,
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie(env.REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_OPTIONS);
}

function extractRefreshToken(req: Request): string | undefined {
  return req.cookies?.[env.REFRESH_COOKIE_NAME] ?? req.body?.refreshToken;
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      sendSuccess(res, user, 'Account created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      setRefreshCookie(res, result.refreshToken);
      sendSuccess(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = extractRefreshToken(req);
      if (!rawRefreshToken) throw ApiError.unauthorized('Refresh token missing');

      const result = await authService.refresh(rawRefreshToken);
      setRefreshCookie(res, result.refreshToken);
      sendSuccess(res, { accessToken: result.accessToken }, 'Token refreshed');
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = extractRefreshToken(req);
      if (rawRefreshToken) {
        await authService.logout(rawRefreshToken);
      }
      res.clearCookie(env.REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const user = await authService.me(req.user.id);
      sendSuccess(res, user, 'Current user profile');
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body);
      sendSuccess(res, null, 'If that email is registered, a reset link has been sent');
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      sendSuccess(res, null, 'Password reset successfully');
    } catch (err) {
      next(err);
    }
  },
};
