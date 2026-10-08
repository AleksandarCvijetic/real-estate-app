import { Link } from "react-router-dom";
import { listingApi } from "../api/listingApi";
import { ListingCard } from "../components/listings/ListingCard";
import { useFavorites } from "../context/FavoritesContext";
import { useAsyncData } from "../hooks/useAsyncData";

// Backend vraca samo ID-jeve omiljenih oglasa, pa se svaki oglas dohvata posebno.
// Oglasi koji vise ne postoje se preskacu. Funkcija je van komponente, pa je stabilna za useAsyncData.
async function fetchFavoriteListings() {
  const favorites = await listingApi.getMyFavorites();
  const newestFirst = [...favorites].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const results = await Promise.allSettled(newestFirst.map((favorite) => listingApi.getById(String(favorite.listingId))));
  return results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

export function FavoritesPage() {
  const { data, error, isLoading } = useAsyncData(fetchFavoriteListings);
  const { isLoaded, isFavorite } = useFavorites();

  // Oglas uklonjen klikom na srce odmah nestaje sa stranice.
  const listings = (data ?? []).filter((listing) => !isLoaded || isFavorite(listing.id));

  return (
    <>
      <h1 className="page-title">Omiljeni oglasi</h1>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading && <p>Učitavanje...</p>}

      {data && listings.length === 0 && (
        <div className="empty">
          <p>Još uvek nemaš omiljene oglase. Klikni na srce na oglasu da ga sačuvaš ovde.</p>
          <Link to="/" className="btn btn--primary">
            Pregledaj oglase
          </Link>
        </div>
      )}

      {listings.length > 0 && (
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}
