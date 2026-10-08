import type { AccountType } from "../types/auth";
import type { Role } from "../types/user";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  INDIVIDUAL: "Fizičko lice",
  AGENT: "Agent",
};

export const ROLE_LABELS: Record<Role, string> = {
  USER: "Korisnik",
  ADMIN: "Administrator",
};
