const STORAGE_KEY = "omur-cocuk:favorites";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

let cache: string[] = isBrowser() ? parseIds(window.localStorage.getItem(STORAGE_KEY)) : [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(next: string[]) {
  cache = next;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage kullanılamıyorsa (gizli sekme vb.) sessizce yoksay.
    }
  }
  emit();
}

/** useSyncExternalStore ile kullanılmak üzere favori listesine abone olur. */
export function subscribeFavorites(callback: () => void): () => void {
  listeners.add(callback);

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cache = parseIds(event.newValue);
      callback();
    }
  }

  if (isBrowser()) window.addEventListener("storage", handleStorageEvent);
  return () => {
    listeners.delete(callback);
    if (isBrowser()) window.removeEventListener("storage", handleStorageEvent);
  };
}

export function getFavoritesSnapshot(): string[] {
  return cache;
}

const EMPTY_SNAPSHOT: string[] = [];

export function getServerFavoritesSnapshot(): string[] {
  return EMPTY_SNAPSHOT;
}

export function isFavorite(productId: string): boolean {
  return cache.includes(productId);
}

export function toggleFavorite(productId: string): string[] {
  const next = cache.includes(productId)
    ? cache.filter((id) => id !== productId)
    : [...cache, productId];
  persist(next);
  return next;
}
