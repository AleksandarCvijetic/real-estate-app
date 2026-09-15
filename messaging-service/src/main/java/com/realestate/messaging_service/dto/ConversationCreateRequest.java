package com.realestate.messaging_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationCreateRequest {

    @NotNull
    private Long listingId;

    @NotNull
    private Long receiverId;
}