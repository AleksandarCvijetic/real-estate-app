package com.realestate.messaging_service.repository;

import com.realestate.messaging_service.entity.Message;
import com.realestate.messaging_service.entity.enums.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversation_IdOrderBySentAtAsc(Long conversationId);

    List<Message> findByConversation_IdAndSenderIdNotAndStatus(
            Long conversationId, Long senderId, MessageStatus status);

    long countByConversation_IdAndSenderIdNotAndStatus(
            Long conversationId, Long senderId, MessageStatus status);

    Optional<Message> findFirstByConversation_IdOrderBySentAtDesc(Long conversationId);

    // Broj neprocitanih poruka po razgovoru, jednim upitom za celu listu razgovora.
    @Query("""
            SELECT m.conversation.id, COUNT(m) FROM Message m
            WHERE m.conversation.id IN :conversationIds
            AND m.senderId <> :userId
            AND m.status = :status
            GROUP BY m.conversation.id
            """)
    List<Object[]> countByConversationIds(
            @Param("conversationIds") List<Long> conversationIds,
            @Param("userId") Long userId,
            @Param("status") MessageStatus status
    );
}