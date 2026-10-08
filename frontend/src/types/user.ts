import type { AccountType } from "./auth";

export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  accountType: AccountType;
}
