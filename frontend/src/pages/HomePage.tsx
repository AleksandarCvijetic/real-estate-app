import { useCallback, useState } from "react";
import { listingApi } from "../api/listingApi";
import { ListingCard } from "../components/listings/ListingCard";
import { ListingFilters } from "../components/listings/ListingFilters";
import { Pagination } from "../components/Pagination";
import { useAsyncData } from "../hooks/useAsyncData";
import { EMPTY_FILTERS, toSearchRequest, type ListingFilterValues } from "../lib/listingFilters";
import type { Listing, ListingSearchRequest, Page } from "../types/listing";

const PAGE_SIZE = 12;
// Semanticka pretraga nema paginaciju; backend vraca najvise 50 najrelevantnijih oglasa.
const SEMANTIC_LIMIT = 50;

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Najnovije" },
  { value: "price,asc", label: "Cena: rastuća" },
  { value: "price,desc", label: "Cena: opadajuća" },
];

interface AppliedSearch {
  query: string; // prazan = obicna pretraga po filterima
  filters: ListingSearchRequest;
}

export function HomePage() {
  // "draft" prati ono sto korisnik kuca; "applied" je ono sto je stvarno poslato na server.
  const [draft, setDraft] = useState<ListingFilterValues>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<AppliedSearch>({ query: "", filters: {} });
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(0);

  const isSemantic = applied.query !== "";

  const fetchListings = useCallback((): Promise<Page<Listing>> => {
    if (applied.query) {
      return listingApi.semanticSearch(applied.query, applied.filters, SEMANTIC_LIMIT).then((listings) => ({
        content: listings,
        totalElements: listings.length,
        totalPages: 1,
        number: 0,
      }));
    }
    return listingApi.search(applied.filters, { page, size: PAGE_SIZE, sort });
  }, [applied, page, sort]);
  const { data, error, isLoading } = useAsyncData(fetchListings);

  function applyFilters() {
    setApplied({ query: draft.query.trim(), filters: toSearchRequest(draft) });
    setPage(0);
  }

  function resetFilters() {
    setDraft(EMPTY_FILTERS);
    setApplied({ query: "", filters: {} });
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
        <span>
          {data &&
            (isSemantic
              ? `Rezultati za „${applied.query}“: ${data.totalElements}, sortirano po relevantnosti`
              : `Pronađeno oglasa: ${data.totalElements}`)}
        </span>
        {!isSemantic && (
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
        )}
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading && <p>{isSemantic ? "Tražimo oglase koji odgovaraju opisu..." : "Učitavanje..."}</p>}

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

      {data && !isSemantic && (
        <Pagination page={data.number} totalPages={data.totalPages} onPageChange={changePage} />
      )}
    </>
  );
}
