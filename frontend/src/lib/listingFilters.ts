import type { ListingSearchRequest, ListingType, PropertyType } from "../types/listing";
import { parseNumber as toNumber } from "./parseNumber";

// Vrednosti iz forme ostaju stringovi (kontrolisani inputi); u zahtev se pretvaraju tek pri primeni filtera.
export interface ListingFilterValues {
  query: string; // tekst iz search bara -> semanticka (AI) pretraga
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
  query: "",
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

// Prazna polja se izostavljaju; parking/ljubimci filtriraju samo kada su cekirani.
// Upit (query) nije deo filtera - salje se posebno, samo semantickoj pretrazi.
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
