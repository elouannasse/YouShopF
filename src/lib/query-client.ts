import { QueryClient } from "@tanstack/react-query";

/**
 * Configuration par défaut pour React Query
 */
export const queryConfig = {
  queries: {
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes (anciennement cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    retry: false,
  },
};

/**
 * Créer une instance de QueryClient avec la configuration
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}
