package com.realestate.messaging_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long id;
    private Long listingId;
    private Long otherUserId;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;
}