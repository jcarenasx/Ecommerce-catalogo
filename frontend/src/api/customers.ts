import client from "./client";

export type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
};

export type CustomerPayload = {
  name: string;
  phone: string;
};

export async function fetchCustomers(): Promise<CustomerRecord[]> {
  const response = await client.get<{ customers: CustomerRecord[] }>("/customers");
  return response.data.customers;
}

export async function createCustomer(payload: CustomerPayload): Promise<void> {
  await client.post("/customers", payload);
}
