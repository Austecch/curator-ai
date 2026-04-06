"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface AuthContextType {
  user: ReturnType<typeof useAuth>["user"];
  session: ReturnType<typeof useAuth>["session"];
  profile: ReturnType<typeof useAuth>["profile"];
  loading: ReturnType<typeof useAuth>["loading"];
  error: ReturnType<typeof useAuth>["error"];
  signIn: ReturnType<typeof useAuth>["signIn"];
  signUp: ReturnType<typeof useAuth>["signUp"];
  signOut: ReturnType<typeof useAuth>["signOut"];
  isAuthenticated: ReturnType<typeof useAuth>["isAuthenticated"];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
