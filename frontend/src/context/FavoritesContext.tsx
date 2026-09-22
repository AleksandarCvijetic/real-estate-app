import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { listingApi } from "../api/listingApi";

interface FavoritesContextValue {
  isLoaded: boolean;
  isFavorite: (listingId: number) => boolean;
  isPending: (listingId: number) => boolean;
  toggleFavorite: (listingId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

function withId(ids: Set<number>, listingId: number, present: boolean): Set<number> {
  const next = new Set(ids);
  if (present) {
    next.add(listingId);
  } else {
    next.delete(listingId);
  }
  return next;
}

// Skup ID-jeva omiljenih oglasa, ucitan jednom po prijavi, da bi srce bilo tacno na svakoj stranici.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set());
  const [pendingIds, setPendingIds] = useState<Set<number>>(() => new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listingApi.getMyFavorites().then(
      (favorites) => {
        if (cancelled) return;
        setFavoriteIds(new Set(favorites.map((favorite) => favorite.listingId)));
        setIsLoaded(true);
      },
      () => undefined
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback((listingId: number) => favoriteIds.has(listingId), [favoriteIds]);
  const isPending = useCallback((listingId: number) => pendingIds.has(listingId), [pendingIds]);

  // Optimisticki menja stanje odmah, a vraca ga ako backend odbije zahtev.
  const toggleFavorite = useCallback(
    async (listingId: number) => {
      if (pendingIds.has(listingId)) return;
      const shouldAdd = !favoriteIds.has(listingId);

      setFavoriteIds((ids) => withId(ids, listingId, shouldAdd));
      setPendingIds((ids) => withId(ids, listingId, true));
      try {
        if (shouldAdd) {
          await listingApi.addFavorite(listingId);
        } else {
          await listingApi.removeFavorite(listingId);
        }
      } catch (err) {
        setFavoriteIds((ids) => withId(ids, listingId, !shouldAdd));
        throw err;
      } finally {
        setPendingIds((ids) => withId(ids, listingId, false));
      }
    },
    [favoriteIds, pendingIds]
  );

  const value = useMemo(
    () => ({ isLoaded, isFavorite, isPending, toggleFavorite }),
    [isLoaded, isFavorite, isPending, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
