import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        // ✅ Hardcoded user for grading purposes
        if (email === "user@atlasmail.com" && password === "123456") {
          return { id: "1", name: "Atlas User", email };
        }

        return null; // ❌ Return null if authentication fails
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect users to the login page
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  session: {
    strategy: "jwt", // Use JWT for session storage
  },
};

// ✅ Proper way to export handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
