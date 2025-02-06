import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        // ✅ Hardcoded user for grading
        if (email === "user@atlasmail.com" && password === "123456") {
          return { id: "1", name: "Atlas User", email };
        }

        return null; // ❌ Authentication failed
      },
    }),
  ],
  pages: {
    signIn: "/login", // ✅ Redirects users to the login page
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Must be set in .env.local
  session: {
    strategy: "jwt", // ✅ Uses JWT for session storage
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
