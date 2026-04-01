import type { AvailabilityTag } from "../types";
import {
  createAvailabilityTag as createAvailabilityTagApi,
  deleteAvailabilityTag as deleteAvailabilityTagApi,
  fetchAvailabilityTags as fetchAvailabilityTagsApi,
} from "../api/availability";

export async function loadAvailabilityTags(): Promise<AvailabilityTag[]> {
  return fetchAvailabilityTagsApi();
}

export async function createNewAvailabilityTag(name: string): Promise<AvailabilityTag> {
  return createAvailabilityTagApi(name);
}

export async function removeAvailabilityTag(id: string): Promise<void> {
  return deleteAvailabilityTagApi(id);
}
