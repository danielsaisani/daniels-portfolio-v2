import NextAuth from 'next-auth';
import type { NextAuthOptions } from "next-auth";
import GitHub from 'next-auth/providers/github';

export const options: NextAuthOptions= {
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
});
