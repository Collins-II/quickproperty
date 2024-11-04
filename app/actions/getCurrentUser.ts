import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import User from "../lib/database/models/user.model";
import handler from "@/pages/api/auth/[...nextauth]";
// Ensure you have the authOptions exported from your NextAuth configuration

export async function getSession(): Promise<Session | null> {
  return await getServerSession(handler);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return null;
    }

    // Assuming session.user contains the user's id
    const email = session.user.email;

    if (!email) {
      return null;
    }

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      return null;
    }

    // Format dates to ISO string
    return {
      ...currentUser.toObject(),
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
