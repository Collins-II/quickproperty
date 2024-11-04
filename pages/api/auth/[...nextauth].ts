import NextAuth, { Account, DefaultSession, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CreateUserParams } from "@/app/types/index";

import { createUser, getUserByEmail } from "@/app/actions/user.actions";
import { connectToDatabase } from "@/app/lib/database";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      _id: string;
    } & DefaultSession["user"];
  }
}

export interface ExtendedUser extends User {
  accessToken?: string;
  id: string; // Add id field to ExtendedUser
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        await connectToDatabase(); // Ensure the database connection is established

        const sessionUser = await getUserByEmail(session.user.email ?? "");

        if (!sessionUser) {
          const registeredUser = await createUser(session.user as CreateUserParams);
          session.user._id = registeredUser._id;
        } else {
          session.user._id = sessionUser._id;
        }
      }
      return session;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      user: ExtendedUser;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }): Promise<boolean> {
      try {
        await connectToDatabase(); // Ensure the database connection is established

        if (profile) {
          const sessionUser = await getUserByEmail(profile.email ?? "");

          if (!sessionUser) {
            const registeredUser = await createUser(profile as CreateUserParams);
            user.id = registeredUser._id;
          } else {
            user.id = sessionUser._id;
          }
        }

        // Extract the access token from the Google account
        const accessToken = account?.accessToken;

        // Save the access token to the session.user object
        if (typeof accessToken === "string") {
          user.accessToken = accessToken;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
export default handler;
