export type ListingType = "RENT" | "SALE";
export type PropertyType = "APARTMENT" | "HOUSE";
export type FurnishingStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
export type HeatingType = "CENTRAL" | "ETAZNO" | "TA_PEC" | "ELECTRIC" | "GAS" | "NONE";
export type ListingStatus = "ACTIVE" | "RENTED" | "SOLD" | "INACTIVE";

export interface ListingImage {
  id: number;
  url: string;
  displayOrder: number;
}

export interface Listing {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  phoneNumber: string;
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
  images: ListingImage[];
}

export interface ListingCreateRequest {
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  phoneNumber: string;
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

// Odgovor semanticke pretrage: oglas + slicnost sa upitom, vec sortirano po relevantnosti.
export interface SemanticListingResult {
  listing: Listing;
  score: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface FavoriteListing {
  id: number;
  listingId: number;
  createdAt: string;
}

export type ReportReason = "SPAM" | "INAPPROPRIATE_CONTENT" | "MISLEADING_INFORMATION" | "DUPLICATE" | "OTHER";

export interface ReportCreateRequest {
  listingId: number;
  reason: ReportReason;
}

export type ReportStatus = "PENDING" | "REVIEWED" | "REJECTED";

export interface Report {
  id: number;
  listingId: number;
  listingTitle: string;
  listingLocation: string;
  listingOwnerId: number;
  reportingUserId: number;
  reason: ReportReason;
  status: ReportStatus;
  createdAt: string;
}
