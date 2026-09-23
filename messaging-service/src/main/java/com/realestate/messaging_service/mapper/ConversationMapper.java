package com.realestate.messaging_service.mapper;

import com.realestate.messaging_service.dto.ConversationResponse;
import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.entity.Message;

public class ConversationMapper {

    private ConversationMapper() {}

    public static ConversationResponse toResponse(Conversation conversation, Long currentUserId) {
        return toResponse(conversation, currentUserId, null, 0);
    }

    public static ConversationResponse toResponse(
            Conversation conversation, Long currentUserId, Message lastMessage, long unreadCount) {
        Long otherUserId = conversation.getUser1Id().equals(currentUserId)
                ? conversation.getUser2Id()
                : conversation.getUser1Id();

        return ConversationResponse.builder()
                .id(conversation.getId())
                .listingId(conversation.getListingId())
                .otherUserId(otherUserId)
                .createdAt(TimeMapper.toInstant(conversation.getCreatedAt()))
                .lastMessageAt(TimeMapper.toInstant(conversation.getLastMessageAt()))
                .lastMessageText(lastMessage != null ? lastMessage.getText() : null)
                .lastMessageSenderId(lastMessage != null ? lastMessage.getSenderId() : null)
                .unreadCount(unreadCount)
                .build();
    }
}
