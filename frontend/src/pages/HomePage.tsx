import { useCallback, useState } from "react";
import { listingApi } from "../api/listingApi";
import { ListingCard } from "../components/listings/ListingCard";
import { ListingFilters } from "../components/listings/ListingFilters";
import { Pagination } from "../components/Pagination";
import { useAsyncData } from "../hooks/useAsyncData";
import { EMPTY_FILTERS, toSearchRequest, type ListingFilterValues } from "../lib/listingFilters";
import type { ListingSearchRequest } from "../types/listing";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Najnovije" },
  { value: "price,asc", label: "Cena: rastuća" },
  { value: "price,desc", label: "Cena: opadajuća" },
];

export function HomePage() {
  // "draft" prati ono sto korisnik kuca; "applied" je ono sto je stvarno poslato na server.
  const [draft, setDraft] = useState<ListingFilterValues>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<ListingSearchRequest>({});
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(0);

  const fetchListings = useCallback(
    () => listingApi.search(applied, { page, size: PAGE_SIZE, sort }),
    [applied, page, sort]
  );
  const { data, error, isLoading } = useAsyncData(fetchListings);

  function applyFilters() {
    setApplied(toSearchRequest(draft));
    setPage(0);
  }

  function resetFilters() {
    setDraft(EMPTY_FILTERS);
    setApplied({});
    setPage(0);
  }

  function changeSort(value: string) {
    setSort(value);
    setPage(0);
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <h1 className="page-title">Oglasi</h1>

      <ListingFilters values={draft} onChange={setDraft} onSubmit={applyFilters} onReset={resetFilters} />

      <div className="toolbar">
        <span>{data ? `Pronađeno oglasa: ${data.totalElements}` : ""}</span>
        <label className="toolbar__sort">
          Sortiraj:
          <select className="control" value={sort} onChange={(e) => changeSort(e.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading && <p>Učitavanje...</p>}

      {data && data.content.length === 0 && (
        <div className="empty">Nema oglasa koji odgovaraju zadatim kriterijumima.</div>
      )}

      {data && data.content.length > 0 && (
        <div className="listing-grid">
          {data.content.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {data && <Pagination page={data.number} totalPages={data.totalPages} onPageChange={changePage} />}
    </>
  );
}
