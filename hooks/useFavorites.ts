"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  subscribeFavorites,
  getFavoritesSnapshot,
  getServerFavoritesSnapshot,
  toggleFavorite as toggleFavoriteStore,
} from "@/lib/favorites";

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot
  );

  const toggleFavorite = useCallback((productId: string) => {
    toggleFavoriteStore(productId);
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite };
}
