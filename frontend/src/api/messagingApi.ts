import { apiClient } from "./client";
import type { Conversation, Message } from "../types/messaging";

// Gateway ruta je "/messagings" (mnozina), kao i @RequestMapping u messaging-service.
export const messagingApi = {
  // Primalac se ne salje: backend ga odredjuje kao vlasnika oglasa. Postojeci razgovor se vraca ponovo.
  startConversation: (listingId: number) =>
    apiClient.post<Conversation>("/messagings/conversations", { listingId }).then((res) => res.data),

  getConversations: () => apiClient.get<Conversation[]>("/messagings/conversations").then((res) => res.data),

  getConversation: (id: number) =>
    apiClient.get<Conversation>(`/messagings/conversations/${id}`).then((res) => res.data),

  deleteConversation: (id: number) =>
    apiClient.delete<void>(`/messagings/conversations/${id}`).then(() => undefined),

  getMessages: (conversationId: number) =>
    apiClient.get<Message[]>(`/messagings/conversations/${conversationId}/messages`).then((res) => res.data),

  sendMessage: (conversationId: number, text: string) =>
    apiClient
      .post<Message>(`/messagings/conversations/${conversationId}/messages`, { text })
      .then((res) => res.data),

  markAsRead: (conversationId: number) =>
    apiClient.patch<void>(`/messagings/conversations/${conversationId}/messages/read`).then(() => undefined),
};
