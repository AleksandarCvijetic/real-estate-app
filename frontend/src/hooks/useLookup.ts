import { useEffect, useState } from "react";

// Razresava jedan entitet po ID-ju preko kesirane funkcije (vidi lib/lookupCache).
// undefined = jos se ucitava, null = ne postoji.
export function useLookup<T>(id: number | null | undefined, load: (id: number) => Promise<T | null>) {
  const [result, setResult] = useState<{ id: number; value: T | null } | null>(null);

  useEffect(() => {
    if (id == null) return;
    let cancelled = false;
    load(id).then((value) => {
      if (!cancelled) setResult({ id, value });
    });
    return () => {
      cancelled = true;
    };
  }, [id, load]);

  return result !== null && result.id === id ? result.value : undefined;
}
