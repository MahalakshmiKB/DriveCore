import { authRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, generateRawToken, hashToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { sendMail, passwordResetEmailHtml } from '../../utils/mailer';
import {
  AuthenticatedUser,
  ForgotPasswordInput,
  LoginInput,
  LoginResult,
  RegisterInput,
  ResetPasswordInput,
} from './auth.types';

function toAuthenticatedUser(user: { id: number; email: string; fullName: string; role: { name: string } }): AuthenticatedUser {
  return { id: user.id, email: user.email, fullName: user.fullName, role: user.role.name };
}

function refreshExpiryDate(): Date {
  // env.JWT_REFRESH_EXPIRES_IN is a duration string like "7d" — for DB bookkeeping
  // we compute a concrete expiry using the same value jsonwebtoken would apply.
  const match = /^(\d+)([smhd])$/.exec(env.JWT_REFRESH_EXPIRES_IN);
  const now = Date.now();
  if (!match) return new Date(now + 7 * 24 * 60 * 60 * 1000);
  const [, amountStr, unit] = match;
  const amount = Number(amountStr);
  const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 86_400_000;
  return new Date(now + amount * unitMs);
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthenticatedUser> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const role = await authRepository.findRoleById(input.roleId);
    if (!role) {
      throw ApiError.badRequest('Invalid roleId');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      roleId: input.roleId,
    });

    await authRepository.writeAuditLog({
      userId: user.id,
      tableName: 'users',
      recordId: user.id,
      action: 'CREATE',
      newValue: JSON.stringify({ email: user.email, role: role.name }),
    });

    return toAuthenticatedUser(user);
  },

  async login(input: LoginInput): Promise<LoginResult> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const authenticatedUser = toAuthenticatedUser(user);
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role.name });
    const { token: refreshToken } = signRefreshToken(user.id);

    await authRepository.storeRefreshToken(user.id, refreshToken, refreshExpiryDate());

    return { accessToken, refreshToken, user: authenticatedUser };
  },

  async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const stored = await authRepository.findRefreshToken(rawRefreshToken);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token is no longer valid');
    }

    const user = await authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Account not found or deactivated');
    }

    // Rotate: revoke the old token, issue a new pair
    await authRepository.revokeRefreshToken(rawRefreshToken);
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role.name });
    const { token: newRefreshToken } = signRefreshToken(user.id);
    await authRepository.storeRefreshToken(user.id, newRefreshToken, refreshExpiryDate());

    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(rawRefreshToken: string): Promise<void> {
    try {
      await authRepository.revokeRefreshToken(rawRefreshToken);
    } catch {
      // token already invalid/unknown — logout is idempotent from the client's POV
    }
  },

  async me(userId: number): Promise<AuthenticatedUser> {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return toAuthenticatedUser(user);
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const user = await authRepository.findUserByEmail(input.email);
    // Always respond as if successful to avoid leaking which emails are registered.
    if (!user) return;

    const rawToken = generateRawToken();
    const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TOKEN_EXPIRES_MIN * 60_000);
    await authRepository.storePasswordResetToken(user.id, rawToken, expiresAt);

    const resetUrl = `${env.PASSWORD_RESET_URL_BASE}?token=${rawToken}`;
    await sendMail(user.email, 'Reset your DriveCore password', passwordResetEmailHtml(resetUrl));
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const resetToken = await authRepository.findValidPasswordResetToken(input.token);
    if (!resetToken) {
      throw ApiError.badRequest('Reset token is invalid or has expired');
    }

    const passwordHash = await hashPassword(input.newPassword);
    await authRepository.updateUserPassword(resetToken.userId, passwordHash);
    await authRepository.markPasswordResetTokenUsed(resetToken.id);
    await authRepository.revokeAllUserRefreshTokens(resetToken.userId);

    await authRepository.writeAuditLog({
      userId: resetToken.userId,
      tableName: 'users',
      recordId: resetToken.userId,
      action: 'PASSWORD_RESET',
    });
  },
};

// re-export for consumers that only need the token-hash helper (e.g. tests)
export { hashToken };
