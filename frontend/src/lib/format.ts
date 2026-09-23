const LOCALE = "sr-RS";

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function formatArea(area: number): string {
  return `${area.toLocaleString(LOCALE)} m²`;
}

export function formatRooms(rooms: number): string {
  // 1 soba, 2-4 sobe, 5+ soba; decimalni brojevi (npr. 2,5) idu uz "sobe".
  const noun = rooms === 1 || (Number.isInteger(rooms) && rooms >= 5) ? "soba" : "sobe";
  return `${rooms.toLocaleString(LOCALE)} ${noun}`;
}

export function formatFloor(floor: number): string {
  return floor === 0 ? "Prizemlje" : `${floor}. sprat`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(LOCALE);
}

export function formatBoolean(value: boolean): string {
  return value ? "Da" : "Ne";
}

const timeFormatter = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" });
const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "numeric" });

// Vreme poruke: danas samo sat, inace i datum.
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? timeFormatter.format(date) : `${shortDateFormatter.format(date)} ${timeFormatter.format(date)}`;
}
