import { prisma } from '../../config/database';
import { hashToken } from '../../utils/jwt';

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },

  findRoleById(roleId: number) {
    return prisma.role.findUnique({ where: { id: roleId } });
  },

  createUser(data: { fullName: string; email: string; passwordHash: string; roleId: number }) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  },

  updateUserPassword(userId: number, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },

  // ── Refresh tokens ──────────────────────────────────────
  storeRefreshToken(userId: number, rawToken: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawToken),
        expiresAt,
      },
    });
  },

  findRefreshToken(rawToken: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
    });
  },

  revokeRefreshToken(rawToken: string) {
    return prisma.refreshToken.update({
      where: { tokenHash: hashToken(rawToken) },
      data: { revokedAt: new Date() },
    });
  },

  revokeAllUserRefreshTokens(userId: number) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  // ── Password reset ──────────────────────────────────────
  storePasswordResetToken(userId: number, rawToken: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawToken),
        expiresAt,
      },
    });
  },

  findValidPasswordResetToken(rawToken: string) {
    return prisma.passwordResetToken.findFirst({
      where: {
        tokenHash: hashToken(rawToken),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  },

  markPasswordResetTokenUsed(id: number) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  },

  // ── Audit ────────────────────────────────────────────────
  writeAuditLog(entry: {
    userId?: number | null;
    tableName: string;
    recordId: number;
    action: string;
    oldValue?: string | null;
    newValue?: string | null;
  }) {
    return prisma.auditLog.create({ data: entry });
  },
};
