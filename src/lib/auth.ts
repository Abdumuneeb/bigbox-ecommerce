import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (cred) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/v1/User/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emailAddress: cred.email,
              password: cred.password,
            }),
          }
        );

        if (!res.ok) {
          console.error("[authorize] login failed:", await res.text());
          return null;
        }

        const response = await res.json();
        const { tokenRes, ...user } = response?.payload || {};

        return {
          id: String(user.userId),
          name: user.userName,
          companyName: user.companyName,
          email: typeof cred.email === "string" ? cred.email : "",
          role: user.role,
          accessToken: tokenRes?.token,
          refreshToken: tokenRes?.refreshToken,
          accessTokenExpires: new Date(tokenRes?.expiry).getTime(),
          refreshTokenExpires: new Date(tokenRes?.refreshTokenExpiry).getTime(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // Initial sign-in
      if (user) {
        token.companyName = user.companyName;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      // If token is still valid, return it
      if (Date.now() < token.accessTokenExpires - 60_000) return token;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/v1/User/refresh_token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          }
        );

        if (!res.ok) throw new Error("Refresh failed");

        const { payload } = await res.json();

        token.accessToken = payload.token;
        token.refreshToken = payload.refreshToken ?? token.refreshToken;
        token.accessTokenExpires = new Date(payload.expiry).getTime();
      } catch {
        token.error = "RefreshTokenError";
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user.companyName = token.companyName;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.error = token.error;

      // Convert to ISO string for consistency
      session.expires = new Date(token.accessTokenExpires).toISOString();

      return session;
    },
  },
  pages: { signIn: "/login" },
  debug: true,
});
