package com.realestate.messaging_service.repository;

import com.realestate.messaging_service.entity.Message;
import com.realestate.messaging_service.entity.enums.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversation_IdOrderBySentAtAsc(Long conversationId);

    List<Message> findByConversation_IdAndSenderIdNotAndStatus(
            Long conversationId, Long senderId, MessageStatus status);

    long countByConversation_IdAndSenderIdNotAndStatus(
            Long conversationId, Long senderId, MessageStatus status);
}