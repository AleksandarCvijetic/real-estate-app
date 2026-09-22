import { baseURL } from "../api/client";

// Backend vraca URL relativan na "/api" prefiks (npr. "/listings/5/images/12").
export function resolveImageUrl(url: string): string {
  return `${baseURL}${url}`;
}
