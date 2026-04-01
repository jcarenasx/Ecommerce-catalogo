import type { CustomerRecord } from "../api/customers";
import { fetchCustomers } from "../api/customers";

export async function loadCustomers(): Promise<CustomerRecord[]> {
  return fetchCustomers();
}
