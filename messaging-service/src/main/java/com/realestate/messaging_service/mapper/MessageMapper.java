package com.realestate.messaging_service.mapper;

import com.realestate.messaging_service.dto.MessageResponse;
import com.realestate.messaging_service.entity.Message;

public class MessageMapper {

    private MessageMapper() {}

    public static MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSenderId())
                .text(message.getText())
                .sentAt(message.getSentAt())
                .status(message.getStatus())
                .build();
    }
}