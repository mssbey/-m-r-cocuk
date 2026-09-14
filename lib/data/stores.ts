import { siteConfig } from "@/lib/config";
import type { StoreInfo } from "@/lib/config";

export const stores: StoreInfo[] = siteConfig.stores;

export function getStoreById(id: string): StoreInfo | undefined {
  return stores.find((s) => s.id === id);
}
