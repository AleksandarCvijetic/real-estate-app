package com.realestate.messaging_service.service;

import com.realestate.messaging_service.dto.ConversationCreateRequest;
import com.realestate.messaging_service.dto.ConversationResponse;
import com.realestate.messaging_service.entity.BlockedUser;
import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.mapper.ConversationMapper;
import com.realestate.messaging_service.repository.BlockedUserRepository;
import com.realestate.messaging_service.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final ConversationAccessValidator accessValidator;


    @Transactional
    public ConversationResponse create(ConversationCreateRequest request, Long currentUserId) {
        if (request.getReceiverId().equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot start a conversation with yourself");
        }

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(request.getReceiverId(), currentUserId)) {
            throw new AccessDeniedException("You cannot message this user");
        }

        Conversation existing = conversationRepository
                .findExisting(request.getListingId(), currentUserId, request.getReceiverId())
                .orElse(null);

        if (existing != null) {
            return ConversationMapper.toResponse(existing, currentUserId);
        }

        Conversation conversation = Conversation.builder()
                .listingId(request.getListingId())
                .user1Id(currentUserId)
                .user2Id(request.getReceiverId())
                .createdAt(LocalDateTime.now())
                .build();

        return ConversationMapper.toResponse(conversationRepository.save(conversation), currentUserId);
    }

    public List<ConversationResponse> getMyConversations(Long currentUserId) {
        return conversationRepository.findActiveForUser(currentUserId).stream()
                .map(c -> ConversationMapper.toResponse(c, currentUserId))
                .toList();
    }

    @Transactional
    public void delete(Long id, Long currentUserId) {
        Conversation conversation = accessValidator.findOrThrow(id);
        accessValidator.checkParticipant(conversation, currentUserId);

        if (conversation.getUser1Id().equals(currentUserId)) {
            conversation.setDeletedByUser1(true);
        } else {
            conversation.setDeletedByUser2(true);
        }

        conversationRepository.save(conversation);
    }

}