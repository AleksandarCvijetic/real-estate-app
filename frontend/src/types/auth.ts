export type AccountType = "INDIVIDUAL" | "AGENT";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}
