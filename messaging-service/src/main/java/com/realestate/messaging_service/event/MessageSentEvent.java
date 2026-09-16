package com.realestate.messaging_service.event;

import java.time.LocalDateTime;

public record MessageSentEvent(
        Long conversationId,
        Long senderId,
        Long receiverId,
        String messageText,
        LocalDateTime sentAt
) {}