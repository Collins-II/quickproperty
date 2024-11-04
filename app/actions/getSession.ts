import handler from "@/pages/api/auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";


export async function getSession(req: any, res: any): Promise<Session | null> {
  return await getServerSession(req, res, handler);
}