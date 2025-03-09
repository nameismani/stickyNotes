"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <NextAuthSessionProvider>
      <Provider store={store}>{children}</Provider>
    </NextAuthSessionProvider>
  );
}
