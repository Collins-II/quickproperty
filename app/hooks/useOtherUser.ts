import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { IUser } from "../lib/database/models/user.model";

const useOtherUser = (conversation: FullConversationType | { users: IUser[] }) => {
  const session = useSession()

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email

    const otherUser = conversation?.users.filter(user => user.email !== currentUserEmail)
    if (otherUser) {
      return otherUser[0]
    }
  }, [conversation?.users, session.data?.user?.email])

  return otherUser
}

export default useOtherUser