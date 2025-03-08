import React from "react";
import AuthForm from "@/components/auth/AuthForm";

interface AuthPageProps {
  searchParams: { tab?: string };
}

const AuthPage = ({ searchParams }: AuthPageProps) => {
  const initialTab = searchParams.tab === "register" ? "register" : "login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-orange-50 p-4">
      <div className="w-full max-w-md">
        <AuthForm initialTab={initialTab as "login" | "register"} />
      </div>
    </div>
  );
};

export default AuthPage;
