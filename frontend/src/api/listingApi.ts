import { apiClient } from "./client";
import type {
  FavoriteListing,
  Listing,
  ListingCreateRequest,
  ListingImage,
  ListingSearchRequest,
  Page,
  Report,
  ReportCreateRequest,
  ReportStatus,
  SemanticListingResult,
} from "../types/listing";

export interface SearchParams {
  page: number;
  size: number;
  sort: string;
}

// Spring Data serijalizuje Page ravno (klasican oblik) ili kroz "page" objekat (DTO mod) - podrzavamo oba.
interface RawPage<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  page?: { totalElements: number; totalPages: number; number: number };
}

function normalizePage<T>(raw: RawPage<T>): Page<T> {
  return {
    content: raw.content,
    totalElements: raw.totalElements ?? raw.page?.totalElements ?? raw.content.length,
    totalPages: raw.totalPages ?? raw.page?.totalPages ?? 1,
    number: raw.number ?? raw.page?.number ?? 0,
  };
}

export const listingApi = {
  search: (request: ListingSearchRequest, params: SearchParams) =>
    apiClient
      .post<RawPage<Listing>>("/listings/search", request, { params })
      .then((res) => normalizePage(res.data)),

  // AI servis rangira oglase po znacenju upita, a listing-service na njih primenjuje filtere.
  semanticSearch: (query: string, filters: ListingSearchRequest, limit: number) =>
    apiClient
      .post<SemanticListingResult[]>("/listings/semantic-search", { query, filters, limit })
      .then((res) => res.data.map((result) => result.listing)),

  create: (request: ListingCreateRequest) => apiClient.post<Listing>("/listings", request).then((res) => res.data),

  getMine: () => apiClient.get<Listing[]>("/listings/my").then((res) => res.data),

  getById: (id: string) => apiClient.get<Listing>(`/listings/${encodeURIComponent(id)}`).then((res) => res.data),

  uploadImages: (listingId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient
      .post<ListingImage[]>(`/listings/${listingId}/images`, formData)
      .then((res) => res.data);
  },

  getMyFavorites: () => apiClient.get<FavoriteListing[]>("/listings/favorite/my").then((res) => res.data),

  addFavorite: (listingId: number) =>
    apiClient.post<FavoriteListing>(`/listings/favorite/${listingId}`).then((res) => res.data),

  removeFavorite: (listingId: number) =>
    apiClient.delete<void>(`/listings/favorite/${listingId}`).then((res) => res.data),

  report: (request: ReportCreateRequest) =>
    apiClient.post<unknown>("/listings/report", request).then(() => undefined),

  // Samo za admina.
  getReports: (status: ReportStatus) =>
    apiClient.get<Report[]>("/listings/report", { params: { status } }).then((res) => res.data),

  acceptReport: (reportId: number) =>
    apiClient.post<void>(`/listings/report/${reportId}/accept`).then(() => undefined),

  rejectReport: (reportId: number) =>
    apiClient.post<Report>(`/listings/report/${reportId}/reject`).then((res) => res.data),
};
