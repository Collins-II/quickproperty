import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import getCurrentUser from "../actions/getCurrentUser";
import { IUser } from "../lib/database/models/user.model";
import ClientOnly from "../components/ClientOnly";

export default async function ConversationLayout({ children }: { children: React.ReactNode }) {
  const conversations = await getConversations();
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null; // Handle the case where the current user is not available
  }

  if (!conversations) {
    return []; // Handle the case where the current user is not available
  }

  return (

    <div className="h-full">
      <ConversationList users={users as IUser[]} initialItems={conversations} />
      {children}
    </div>

  );
}
