import { useQuery } from "@tanstack/react-query";
import type { AvailabilityTag } from "../types";
import { loadAvailabilityTags } from "../services/availabilityTagService";

export function useAvailabilityTags() {
  return useQuery<AvailabilityTag[]>({
    queryKey: ["availability-tags"],
    queryFn: () => loadAvailabilityTags(),
    staleTime: 60_000,
  });
}
