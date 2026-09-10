package com.realestate.user_service.dto;

import com.realestate.user_service.entity.enums.AccountType;
import com.realestate.user_service.entity.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private AccountType accountType;
}