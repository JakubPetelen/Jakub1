// src/app/api/auth/[...nextauth]/authOptions.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET');
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/prihlasenie',
    signOut: '/auth/odhlasenie',
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // After sign out, redirect to home page
      if (url.includes('signout')) {
        return baseUrl;
      }
      // After sign in, redirect to posts page
      if (url.includes('callback') || url.includes('signin')) {
        return `${baseUrl}/prispevok`;
      }
      return url;
    },
  },
};
