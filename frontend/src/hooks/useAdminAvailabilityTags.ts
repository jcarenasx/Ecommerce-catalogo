import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewAvailabilityTag, removeAvailabilityTag } from "../services/availabilityTagService";

export function useAdminAvailabilityTags() {
  const queryClient = useQueryClient();

  const refreshTags = async () => {
    await queryClient.invalidateQueries({ queryKey: ["availability-tags"] });
  };

  const createTag = useMutation({
    mutationFn: (name: string) => createNewAvailabilityTag(name),
    onSuccess: () => {
      void refreshTags();
    },
  });

  const deleteTag = useMutation({
    mutationFn: (id: string) => removeAvailabilityTag(id),
    onSuccess: () => {
      void refreshTags();
    },
  });

  return {
    createTag,
    deleteTag,
  };
}
