package com.realestate.messaging_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedUserResponse {

    private Long id;
    private Long blockedUserId;
    private LocalDateTime createdAt;
}