import { apiClient } from "./client";
import type { Listing, ListingCreateRequest, ListingImage, ListingSearchRequest, Page } from "../types/listing";

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
};
