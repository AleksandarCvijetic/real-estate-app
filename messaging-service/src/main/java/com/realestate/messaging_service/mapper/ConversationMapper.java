package com.realestate.messaging_service.mapper;

import com.realestate.messaging_service.dto.ConversationResponse;
import com.realestate.messaging_service.entity.Conversation;

public class ConversationMapper {

    private ConversationMapper() {}

    public static ConversationResponse toResponse(Conversation conversation, Long currentUserId) {
        Long otherUserId = conversation.getUser1Id().equals(currentUserId)
                ? conversation.getUser2Id()
                : conversation.getUser1Id();

        return ConversationResponse.builder()
                .id(conversation.getId())
                .listingId(conversation.getListingId())
                .otherUserId(otherUserId)
                .createdAt(conversation.getCreatedAt())
                .lastMessageAt(conversation.getLastMessageAt())
                .build();
    }
}