package com.realestate.messaging_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageCreateRequest {

    @NotBlank
    @Size(max = 2000) // kolona messages.text je duzine 2000
    private String text;
}