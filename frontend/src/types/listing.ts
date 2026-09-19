export type ListingType = "RENT" | "SALE";
export type PropertyType = "APARTMENT" | "HOUSE";
export type FurnishingStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
export type HeatingType = "CENTRAL" | "ETAZNO" | "TA_PEC" | "ELECTRIC" | "GAS" | "NONE";
export type ListingStatus = "ACTIVE" | "RENTED" | "SOLD" | "INACTIVE";

export interface Listing {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  listingType: ListingType;
  numberOfRooms: number;
  propertyType: PropertyType;
  floor: number | null;
  furnishingStatus: FurnishingStatus;
  heatingType: HeatingType;
  parking: boolean;
  petFriendly: boolean;
  createdAt: string;
  status: ListingStatus;
}

export interface ListingCreateRequest {
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  listingType: ListingType;
  numberOfRooms: number;
  propertyType: PropertyType;
  floor?: number;
  furnishingStatus: FurnishingStatus;
  heatingType: HeatingType;
  parking: boolean;
  petFriendly: boolean;
}

export interface ListingSearchRequest {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  listingType?: ListingType;
  propertyType?: PropertyType;
  minRooms?: number;
  parking?: boolean;
  petFriendly?: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}
