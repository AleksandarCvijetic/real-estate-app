package com.realestate.messaging_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationCreateRequest {

    // Primalac se ne salje: to je uvek vlasnik oglasa, koga messaging-service pita Listing servis.
    @NotNull
    private Long listingId;
}