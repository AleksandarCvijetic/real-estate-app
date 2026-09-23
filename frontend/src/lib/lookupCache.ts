import { listingApi } from "../api/listingApi";
import { userApi } from "../api/userApi";
import type { Listing } from "../types/listing";
import type { User } from "../types/user";

// Razgovor nosi samo ID oglasa i sagovornika. Isti oglas/korisnik se ponavlja kroz listu
// i chat, pa se svaki dohvata jednom po sesiji stranice. null = ne postoji (npr. obrisan oglas).
const listingCache = new Map<number, Promise<Listing | null>>();
const userCache = new Map<number, Promise<User | null>>();

function cached<T>(cache: Map<number, Promise<T | null>>, id: number, load: () => Promise<T>): Promise<T | null> {
  let promise = cache.get(id);
  if (!promise) {
    promise = load().catch(() => {
      cache.delete(id); // sledeci pokusaj ide ponovo na server
      return null;
    });
    cache.set(id, promise);
  }
  return promise;
}

export const lookupCache = {
  getListing: (id: number) => cached(listingCache, id, () => listingApi.getById(String(id))),
  getUser: (id: number) => cached(userCache, id, () => userApi.getById(id)),
};
