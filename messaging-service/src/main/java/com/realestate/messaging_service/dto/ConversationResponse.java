package com.realestate.messaging_service.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long id;
    private Long listingId;
    private Long otherUserId;
    private Instant createdAt;
    private Instant lastMessageAt;
    private String lastMessageText;
    private Long lastMessageSenderId;
    private long unreadCount;
}