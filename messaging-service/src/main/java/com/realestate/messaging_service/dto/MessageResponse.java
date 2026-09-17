package com.realestate.messaging_service.dto;

import com.realestate.messaging_service.entity.enums.MessageStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long id;
    private Long conversationId;
    private Long senderId;
    private String text;
    private LocalDateTime sentAt;
    private MessageStatus status;
}