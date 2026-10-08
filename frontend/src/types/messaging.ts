export type MessageStatus = "SENT" | "READ";

export interface Conversation {
  id: number;
  listingId: number;
  otherUserId: number;
  createdAt: string;
  lastMessageAt: string | null;
  lastMessageText: string | null;
  lastMessageSenderId: number | null;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  sentAt: string;
  status: MessageStatus;
}
