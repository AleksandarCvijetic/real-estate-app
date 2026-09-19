import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";

interface Settled<T> {
  source: () => Promise<T>;
  data: T | null;
  error: string | null;
}

// Poziva fetcher kad god se njegov identitet promeni (zato ga pozivalac mora da memoizuje sa useCallback).
// Rezultat vazi samo za fetcher koji ga je proizveo, pa "isLoading" nije potrebno postavljati unutar effect-a,
// a zakasneli odgovori za stari zahtev se ignorisu.
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetcher().then(
      (data) => {
        if (!cancelled) setSettled({ source: fetcher, data, error: null });
      },
      (err: unknown) => {
        if (!cancelled) setSettled({ source: fetcher, data: null, error: getApiErrorMessage(err) });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  const current = settled !== null && settled.source === fetcher ? settled : null;

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    isLoading: current === null,
  };
}
