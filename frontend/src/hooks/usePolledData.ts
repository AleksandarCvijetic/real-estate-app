import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";

interface Settled<T> {
  source: () => Promise<T>;
  data: T | null;
  error: string | null;
}

// Kao useAsyncData, ali ponavlja poziv na svakih `intervalMs` (poruke idu preko REST-a, bez push-a).
// Fetcher mora biti memoizovan. Dok je tab sakriven ne salje zahteve.
// refresh() odmah ponovo ucitava, a prethodni podaci ostaju prikazani dok novi ne stignu.
export function usePolledData<T>(fetcher: () => Promise<T>, intervalMs: number) {
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetcher().then(
        (data) => {
          if (!cancelled) setSettled({ source: fetcher, data, error: null });
        },
        (err: unknown) => {
          if (cancelled) return;
          // Kod greske pri osvezavanju zadrzava poslednje uspesno ucitane podatke.
          setSettled((prev) => ({
            source: fetcher,
            data: prev?.source === fetcher ? prev.data : null,
            error: getApiErrorMessage(err),
          }));
        }
      );
    };

    load();
    const intervalId = window.setInterval(() => {
      if (!document.hidden) load();
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [fetcher, intervalMs, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);
  const current = settled !== null && settled.source === fetcher ? settled : null;

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    isLoading: current === null,
    refresh,
  };
}
