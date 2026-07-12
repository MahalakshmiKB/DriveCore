export interface AuthenticatedUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
