package com.realestate.messaging_service.service;

import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConversationAccessValidator {

    private final ConversationRepository conversationRepository;

    public Conversation findOrThrow(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with id: " + id));
    }

    public void checkParticipant(Conversation conversation, Long currentUserId) {
        if (!conversation.getUser1Id().equals(currentUserId) && !conversation.getUser2Id().equals(currentUserId)) {
            throw new AccessDeniedException("You are not a participant of this conversation");
        }
    }
}