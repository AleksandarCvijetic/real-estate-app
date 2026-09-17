package com.realestate.messaging_service.service;

import com.realestate.messaging_service.dto.MessageCreateRequest;
import com.realestate.messaging_service.dto.MessageResponse;
import com.realestate.messaging_service.entity.BlockedUser;
import com.realestate.messaging_service.entity.Conversation;
import com.realestate.messaging_service.entity.Message;
import com.realestate.messaging_service.entity.enums.MessageStatus;
import com.realestate.messaging_service.mapper.MessageMapper;
import com.realestate.messaging_service.repository.BlockedUserRepository;
import com.realestate.messaging_service.repository.ConversationRepository;
import com.realestate.messaging_service.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final ConversationAccessValidator accessValidator;

    @Transactional
    public MessageResponse send(Long conversationId, MessageCreateRequest request, Long senderId) {
        Conversation conversation = accessValidator.findOrThrow(conversationId);
        accessValidator.checkParticipant(conversation, senderId);

        Long receiverId = conversation.getUser1Id().equals(senderId)
                ? conversation.getUser2Id()
                : conversation.getUser1Id();

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(receiverId, senderId)) {
            throw new AccessDeniedException("You cannot message this user");
        }

        Message message = Message.builder()
                .conversation(conversation)
                .senderId(senderId)
                .text(request.getText())
                .sentAt(LocalDateTime.now())
                .status(MessageStatus.SENT)
                .build();

        messageRepository.save(message);

        conversation.setLastMessageAt(message.getSentAt());
        conversationRepository.save(conversation);

        return MessageMapper.toResponse(message);
    }

    public List<MessageResponse> getHistory(Long conversationId, Long currentUserId) {
        Conversation conversation = accessValidator.findOrThrow(conversationId);
        accessValidator.checkParticipant(conversation, currentUserId);

        return messageRepository.findByConversation_IdOrderBySentAtAsc(conversationId).stream()
                .map(MessageMapper::toResponse)
                .toList();
    }

    @Transactional
    public void markAsRead(Long conversationId, Long currentUserId) {
        Conversation conversation = accessValidator.findOrThrow(conversationId);
        accessValidator.checkParticipant(conversation, currentUserId);

        List<Message> unread = messageRepository
                .findByConversation_IdAndSenderIdNotAndStatus(conversationId, currentUserId, MessageStatus.SENT);

        unread.forEach(m -> m.setStatus(MessageStatus.READ));
        messageRepository.saveAll(unread);
    }

    public long countUnread(Long conversationId, Long currentUserId) {
        Conversation conversation = accessValidator.findOrThrow(conversationId);
        accessValidator.checkParticipant(conversation, currentUserId);

        return messageRepository
                .countByConversation_IdAndSenderIdNotAndStatus(conversationId, currentUserId, MessageStatus.SENT);
    }
}