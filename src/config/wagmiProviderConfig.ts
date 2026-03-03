import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Only refetch when data is stale or window refocuses; avoids refetch on every component remount
      refetchOnMount: false,
    },
  },
});
