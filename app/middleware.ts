import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to login if not authenticated
  },
});

export const config = {
  matcher: ["/ui/:path*"], // Protects all /ui/* routes
};

// Protect /ui/* pages
// Redirects unauthenticated users to /login