// Prihvata i zarez kao decimalni separator; prazan ili neispravan unos daje undefined.
export function parseNumber(value: string): number | undefined {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}
