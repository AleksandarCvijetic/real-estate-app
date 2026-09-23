package com.realestate.messaging_service.service;

import com.realestate.messaging_service.client.ListingServiceClient;
import com.realestate.messaging_service.dto.ConversationCreateRequest;
import com.realestate.messaging_service.dto.ConversationResponse;
import com.realestate.messaging_service.entity.BlockedUser;
import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.entity.enums.MessageStatus;
import com.realestate.messaging_service.mapper.ConversationMapper;
import com.realestate.messaging_service.repository.BlockedUserRepository;
import com.realestate.messaging_service.repository.ConversationRepository;
import com.realestate.messaging_service.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final ConversationAccessValidator accessValidator;
    private final MessageRepository messageRepository;
    private final ListingServiceClient listingServiceClient;


    @Transactional
    public ConversationResponse create(ConversationCreateRequest request, Long currentUserId) {
        Long receiverId = listingServiceClient.getOwnerId(request.getListingId());

        if (receiverId.equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot start a conversation about your own listing");
        }

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(receiverId, currentUserId)) {
            throw new AccessDeniedException("You cannot message this user");
        }

        Conversation existing = conversationRepository
                .findExisting(request.getListingId(), currentUserId, receiverId)
                .orElse(null);

        if (existing != null) {
            // Korisnik koji je ranije obrisao razgovor ponovo ga vidi kad ga otvori sa oglasa.
            restoreFor(existing, currentUserId);
            return toResponse(conversationRepository.save(existing), currentUserId);
        }

        Conversation conversation = Conversation.builder()
                .listingId(request.getListingId())
                .user1Id(currentUserId)
                .user2Id(receiverId)
                .createdAt(LocalDateTime.now())
                .build();

        return ConversationMapper.toResponse(conversationRepository.save(conversation), currentUserId);
    }

    public ConversationResponse getById(Long id, Long currentUserId) {
        Conversation conversation = accessValidator.findOrThrow(id);
        accessValidator.checkParticipant(conversation, currentUserId);
        return toResponse(conversation, currentUserId);
    }

    public List<ConversationResponse> getMyConversations(Long currentUserId) {
        List<Conversation> conversations = conversationRepository.findActiveForUser(currentUserId);
        if (conversations.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> unreadByConversation = new HashMap<>();
        for (Object[] row : messageRepository.countByConversationIds(
                conversations.stream().map(Conversation::getId).toList(), currentUserId, MessageStatus.SENT)) {
            unreadByConversation.put((Long) row[0], (Long) row[1]);
        }

        return conversations.stream()
                .map(c -> ConversationMapper.toResponse(
                        c,
                        currentUserId,
                        messageRepository.findFirstByConversation_IdOrderBySentAtDesc(c.getId()).orElse(null),
                        unreadByConversation.getOrDefault(c.getId(), 0L)))
                .toList();
    }

    private ConversationResponse toResponse(Conversation conversation, Long currentUserId) {
        return ConversationMapper.toResponse(
                conversation,
                currentUserId,
                messageRepository.findFirstByConversation_IdOrderBySentAtDesc(conversation.getId()).orElse(null),
                messageRepository.countByConversation_IdAndSenderIdNotAndStatus(
                        conversation.getId(), currentUserId, MessageStatus.SENT));
    }

    private void restoreFor(Conversation conversation, Long userId) {
        if (conversation.getUser1Id().equals(userId)) {
            conversation.setDeletedByUser1(false);
        } else {
            conversation.setDeletedByUser2(false);
        }
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