import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    if (body?.errors) {
      return Object.values(body.errors)[0] ?? "Validation failed";
    }
    if (body?.message) {
      return body.message;
    }
    if (error.code === "ERR_NETWORK") {
      return "Server nije dostupan. Proveri da li su servisi pokrenuti.";
    }
  }
  return "Došlo je do neočekivane greške.";
}
