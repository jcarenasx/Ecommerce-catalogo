import type { CustomerPayload } from "../api/customers";
import { createCustomer } from "../api/customers";

export async function registerCustomer(payload: CustomerPayload): Promise<void> {
  return createCustomer(payload);
}
