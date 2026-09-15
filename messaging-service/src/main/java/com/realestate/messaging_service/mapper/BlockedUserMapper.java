package com.realestate.messaging_service.mapper;

import com.realestate.messaging_service.dto.BlockedUserResponse;
import com.realestate.messaging_service.entity.BlockedUser;

public class BlockedUserMapper {

    private BlockedUserMapper() {}

    public static BlockedUserResponse toResponse(BlockedUser blockedUser) {
        return BlockedUserResponse.builder()
                .id(blockedUser.getId())
                .blockedUserId(blockedUser.getBlockedId())
                .createdAt(blockedUser.getCreatedAt())
                .build();
    }
}