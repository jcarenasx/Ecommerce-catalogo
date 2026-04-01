import { useQuery } from "@tanstack/react-query";
import type { CustomerRecord } from "../api/customers";
import { loadCustomers } from "../services/customerListService";

export function useCustomers() {
  return useQuery<CustomerRecord[]>({
    queryKey: ["customers"],
    queryFn: () => loadCustomers(),
    staleTime: 60_000,
  });
}
