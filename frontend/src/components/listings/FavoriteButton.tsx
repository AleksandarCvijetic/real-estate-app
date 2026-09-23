import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getApiErrorMessage } from "../../lib/apiError";

interface FavoriteButtonProps {
  listingId: number;
  ownerId: number;
  // "icon" = okruglo dugme preko slike na kartici, "labeled" = dugme sa tekstom na detaljima oglasa.
  variant?: "icon" | "labeled";
}

export function FavoriteButton({ listingId, ownerId, variant = "icon" }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, isPending, toggleFavorite } = useFavorites();
  const [error, setError] = useState<string | null>(null);

  // Omiljeni zahtevaju prijavu, a svoj oglas korisnik ne cuva u omiljene.
  if (!user || user.id === ownerId) return null;

  const active = isFavorite(listingId);
  const label = active ? "Ukloni iz omiljenih" : "Dodaj u omiljene";

  const handleClick = () => {
    setError(null);
    toggleFavorite(listingId).catch((err: unknown) => setError(getApiErrorMessage(err)));
  };

  return (
    <button
      type="button"
      className={`favorite-btn favorite-btn--${variant}${active ? " is-active" : ""}`}
      onClick={handleClick}
      disabled={isPending(listingId)}
      aria-pressed={active}
      aria-label={variant === "icon" ? label : undefined}
      title={error ?? label}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.7 3.4 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
      </svg>
      {variant === "labeled" && <span>{active ? "Sačuvano u omiljenim" : "Dodaj u omiljene"}</span>}
    </button>
  );
}
