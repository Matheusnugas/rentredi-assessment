import { QueryClient } from "@tanstack/react-query";
import { analytics } from "./analytics";

type QueryError = Error & {
  response?: {
    status: number;
    [key: string]: any;
  };
  [key: string]: any;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount: number, error: QueryError) => {
        if (
          error?.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {},
  },
});

// Add global query/mutation listeners
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "success") {
    analytics.trackUserAction("query_success", {
      queryKey: event.query.queryKey,
      dataSize: JSON.stringify(event.query.state.data).length,
    });
  } else if (event.type === "updated" && event.action.type === "error") {
    analytics.trackUserAction("query_error", {
      queryKey: event.query.queryKey,
      errorMessage: event.query.state.error?.message,
    });
    if (event.query.state.error) {
      analytics.trackError(event.query.state.error as Error, {
        context: "react_query",
        queryKey: event.query.queryKey,
      });
    }
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.mutation.state.status === "success") {
    analytics.trackUserAction("mutation_success", {
      mutationKey: event.mutation.options.mutationKey,
      dataSize: JSON.stringify(event.mutation.state.data).length,
    });
  } else if (
    event.type === "updated" &&
    event.mutation.state.status === "error"
  ) {
    analytics.trackUserAction("mutation_error", {
      mutationKey: event.mutation.options.mutationKey,
      errorMessage: event.mutation.state.error?.message,
    });
    if (event.mutation.state.error) {
      analytics.trackError(event.mutation.state.error as Error, {
        context: "react_query_mutation",
        mutationKey: event.mutation.options.mutationKey,
      });
    }
  }
});
