import type { Product } from "../types";

function toTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function sortProductsByNewest(products: Product[]) {
  return [...products].sort((left, right) => {
    return toTimestamp(right.createdAt) - toTimestamp(left.createdAt);
  });
}

export function getRecentProducts(products: Product[], limit?: number) {
  const sorted = sortProductsByNewest(products);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
