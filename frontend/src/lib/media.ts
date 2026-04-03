import { API_BASE_URL } from "./api";

export function resolveMediaUrl(value: string): string {
  const src = value.trim();
  if (src === "") return src;

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  try {
    return new URL(src, `${API_BASE_URL}/`).toString();
  } catch {
    return src;
  }
}
