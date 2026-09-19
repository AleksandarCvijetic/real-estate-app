import type {
  FurnishingStatus,
  HeatingType,
  ListingCreateRequest,
  ListingType,
  PropertyType,
} from "../types/listing";
import { parseNumber } from "./parseNumber";

// Enumi se u formi drze kao engleske vrednosti iz backenda (npr. "SEMI_FURNISHED"), a korisniku se prikazuju
// srpske labele iz listingLabels.ts. "" znaci da korisnik jos nije izabrao.
export interface ListingFormValues {
  title: string;
  description: string;
  price: string;
  area: string;
  location: string;
  listingType: "" | ListingType;
  numberOfRooms: string;
  propertyType: "" | PropertyType;
  floor: string;
  furnishingStatus: "" | FurnishingStatus;
  heatingType: "" | HeatingType;
  parking: boolean;
  petFriendly: boolean;
}

export const EMPTY_LISTING_FORM: ListingFormValues = {
  title: "",
  description: "",
  price: "",
  area: "",
  location: "",
  listingType: "",
  numberOfRooms: "",
  propertyType: "",
  floor: "",
  furnishingStatus: "",
  heatingType: "",
  parking: false,
  petFriendly: false,
};

// Vraca null ako nesto obavezno nedostaje (forma to vec sprecava preko "required", ovo je i zastita tipova).
export function toCreateRequest(values: ListingFormValues): ListingCreateRequest | null {
  const price = parseNumber(values.price);
  const area = parseNumber(values.area);
  const numberOfRooms = parseNumber(values.numberOfRooms);

  if (
    price === undefined ||
    area === undefined ||
    numberOfRooms === undefined ||
    !values.listingType ||
    !values.propertyType ||
    !values.furnishingStatus ||
    !values.heatingType
  ) {
    return null;
  }

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    price,
    area,
    location: values.location.trim(),
    listingType: values.listingType,
    numberOfRooms,
    propertyType: values.propertyType,
    // Kuce nemaju sprat.
    floor: values.propertyType === "HOUSE" ? undefined : parseNumber(values.floor),
    furnishingStatus: values.furnishingStatus,
    heatingType: values.heatingType,
    parking: values.parking,
    petFriendly: values.petFriendly,
  };
}
