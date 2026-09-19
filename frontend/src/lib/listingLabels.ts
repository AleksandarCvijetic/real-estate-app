import type { FurnishingStatus, HeatingType, ListingStatus, ListingType, PropertyType } from "../types/listing";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  RENT: "Izdavanje",
  SALE: "Prodaja",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: "Stan",
  HOUSE: "Kuća",
};

export const FURNISHING_LABELS: Record<FurnishingStatus, string> = {
  FURNISHED: "Namešten",
  SEMI_FURNISHED: "Polunamešten",
  UNFURNISHED: "Nenamešten",
};

export const HEATING_LABELS: Record<HeatingType, string> = {
  CENTRAL: "Centralno",
  ETAZNO: "Etažno",
  TA_PEC: "TA peć",
  ELECTRIC: "Električno",
  GAS: "Gasno",
  NONE: "Bez grejanja",
};

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  ACTIVE: "Aktivan",
  RENTED: "Izdat",
  SOLD: "Prodat",
  INACTIVE: "Neaktivan",
};

// Dodatna CSS klasa za bedz statusa (prazno = neutralni bedz).
export const LISTING_STATUS_BADGES: Record<ListingStatus, string> = {
  ACTIVE: "badge--success",
  RENTED: "badge--accent",
  SOLD: "badge--accent",
  INACTIVE: "",
};

export function toOptions<T extends string>(labels: Record<T, string>): { value: T; label: string }[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
