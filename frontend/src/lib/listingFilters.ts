import type { ListingSearchRequest, ListingType, PropertyType } from "../types/listing";

// Vrednosti iz forme ostaju stringovi (kontrolisani inputi); u zahtev se pretvaraju tek pri primeni filtera.
export interface ListingFilterValues {
  location: string;
  listingType: "" | ListingType;
  propertyType: "" | PropertyType;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  minRooms: string;
  parking: boolean;
  petFriendly: boolean;
}

export const EMPTY_FILTERS: ListingFilterValues = {
  location: "",
  listingType: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  minRooms: "",
  parking: false,
  petFriendly: false,
};

function toNumber(value: string): number | undefined {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

// Prazna polja se izostavljaju; parking/ljubimci filtriraju samo kada su cekirani.
export function toSearchRequest(values: ListingFilterValues): ListingSearchRequest {
  return {
    location: values.location.trim() || undefined,
    listingType: values.listingType || undefined,
    propertyType: values.propertyType || undefined,
    minPrice: toNumber(values.minPrice),
    maxPrice: toNumber(values.maxPrice),
    minArea: toNumber(values.minArea),
    maxArea: toNumber(values.maxArea),
    minRooms: toNumber(values.minRooms),
    parking: values.parking || undefined,
    petFriendly: values.petFriendly || undefined,
  };
}
