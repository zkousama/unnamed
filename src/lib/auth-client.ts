// File: src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { queryOptions } from "@tanstack/react-query";

// Enhanced auth client with proper types for credentials authentication
export const { 
  useSession, 
  signIn, 
  signOut, 
  signUp, 
  getSession 
} = createAuthClient({
  baseURL: "http://localhost:3000",
  redirectTo: "/",
});

// Custom query hooks for use with TanStack Query
export const sessionQueryOptions = () => {
  return queryOptions({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await getSession();
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Define proper types for the credential auth functions responses
export interface AuthResult {
  success: boolean;
  error?: string;
  session?: any; // Replace with your actual session type
}

// Helper function to handle API errors consistently
export const handleAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected authentication error occurred";
};