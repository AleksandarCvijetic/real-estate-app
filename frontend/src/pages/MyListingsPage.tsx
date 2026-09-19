import { useCallback, useMemo } from "react";
import { listingApi } from "../api/listingApi";
import { ListingCard } from "../components/listings/ListingCard";
import { useAsyncData } from "../hooks/useAsyncData";

export function MyListingsPage() {
  const fetchMine = useCallback(() => listingApi.getMine(), []);
  const { data, error, isLoading } = useAsyncData(fetchMine);

  // Backend vraca oglase bez garantovanog redosleda; najnoviji prvi.
  const listings = useMemo(
    () => (data ? [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
    [data]
  );

  return (
    <>
      <h1 className="page-title">Moji oglasi</h1>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading && <p>Učitavanje...</p>}

      {data && listings.length === 0 && <div className="empty">Još uvek nemaš nijedan oglas.</div>}

      {listings.length > 0 && (
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} showStatus />
          ))}
        </div>
      )}
    </>
  );
}
