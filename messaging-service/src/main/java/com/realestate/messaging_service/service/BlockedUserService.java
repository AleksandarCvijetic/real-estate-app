package com.realestate.messaging_service.service;

import com.realestate.messaging_service.dto.BlockedUserResponse;
import com.realestate.messaging_service.entity.BlockedUser;
import com.realestate.messaging_service.mapper.BlockedUserMapper;
import com.realestate.messaging_service.repository.BlockedUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockedUserService {

    private final BlockedUserRepository blockedUserRepository;

    @Transactional
    public BlockedUserResponse block(Long blockedId, Long blockerId) {
        if (blockedId.equals(blockerId)) {
            throw new IllegalArgumentException("Cannot block yourself");
        }

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            throw new IllegalStateException("User is already blocked");
        }

        BlockedUser blockedUser = BlockedUser.builder()
                .blockerId(blockerId)
                .blockedId(blockedId)
                .createdAt(LocalDateTime.now())
                .build();

        return BlockedUserMapper.toResponse(blockedUserRepository.save(blockedUser));
    }

    @Transactional
    public void unblock(Long blockedId, Long blockerId) {
        if (!blockedUserRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            throw new IllegalArgumentException("This user is not blocked");
        }

        blockedUserRepository.deleteByBlockerIdAndBlockedId(blockerId, blockedId);
    }

    public List<BlockedUserResponse> getMyBlockedUsers(Long blockerId) {
        return blockedUserRepository.findByBlockerId(blockerId).stream()
                .map(BlockedUserMapper::toResponse)
                .toList();
    }
}