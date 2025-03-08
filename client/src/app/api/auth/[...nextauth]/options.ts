import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("API Response:", response.data);

          if (response.data) {
            return {
              id: response.data?.user?.user_id || "1",
              email:
                response.data?.user?.user_email || response.data?.user?.email,
              name:
                response.data?.user?.user_name ||
                response.data.user.username ||
                response.data.user.name ||
                "User",
              accessToken: response.data.access_token,
              ...response.data.user,
            };
          }

          return null;
        } catch (error: any) {
          console.error("NextAuth error:", JSON.stringify(error));
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Authentication failed";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  // debug: true,
  // session: {
  //   strategy: "jwt",
  //   // maxAge: 30 * 24 * 60 * 60, // 30 days
  //   maxAge: 1 * 24 * 60 * 60, // 1 day
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user?.accessToken;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
