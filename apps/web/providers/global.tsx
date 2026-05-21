"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { trpc } from "~/trpc/client";
import { createTRPCHttpBatchClientClient } from "~/trpc/create-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: Infinity,
    },
  },
});

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCHttpBatchClientClient()],
    }),
  );
  return (

    <QueryClientProvider client={queryClient}>
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            closeButton
            position="top-center"
            richColors
            toastOptions={{ duration: 5000 }}
          />
        </NextThemesProvider>
      </trpc.Provider>
    </QueryClientProvider>

  );
};
