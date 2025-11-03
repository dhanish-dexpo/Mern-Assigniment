import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function parseAllowedEmails() {
  const list = process.env.HR_ALLOWED_EMAILS || "";
  return list
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowed = parseAllowedEmails();
      if (!allowed.length) return false;
      const email = (user.email || "").toLowerCase();
      return allowed.includes(email) || allowed.some((a) => a.startsWith("@") && email.endsWith(a));
    },
    async session({ session }) {
      const allowed = parseAllowedEmails();
      const email = (session?.user?.email || "").toLowerCase();
      const isHR = allowed.includes(email) || allowed.some((a) => a.startsWith("@") && email.endsWith(a));
      (session as any).role = isHR ? "hr" : "user";
      return session;
    },
  },
  pages: {
    signIn: "/hr/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
