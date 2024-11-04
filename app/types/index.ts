import { IConversation } from "../lib/database/models/conversation.model";
import { IListing } from "../lib/database/models/listing.model";
import { IMessage } from "../lib/database/models/message.model";
import { IReservation } from "../lib/database/models/reservation.model";
import { IUser } from "../lib/database/models/user.model";

export type SafeListing = Omit<IListing, "createdAt"> & {
  createdAt: string;
};

export type CreateUserParams = {
  _id: string;
  name: string
  email: string
  image: string
  accessToken: string
}

export type SafeReservation = Omit<
  IReservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

export type FullMessageType = IMessage & {
  sender: IUser;
  seen: IUser[];
};

export type FullConversationType = IConversation & {
  users: IUser[];
  messages: FullMessageType[];
};


export type MessageType = {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
}

export type SafeUser = Omit<
  CreateUserParams,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  favoriteIds: string[]
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params?: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params?: string
  keysToRemove: string[]
}
