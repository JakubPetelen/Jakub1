// src/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id property to the user object
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface Token {
    sub: string; // Ensure that the token has the sub property
  }
}
