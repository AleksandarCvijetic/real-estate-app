package com.realestate.messaging_service.repository;

import com.realestate.messaging_service.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("""
            SELECT c FROM Conversation c
            WHERE c.listingId = :listingId
            AND ((c.user1Id = :userA AND c.user2Id = :userB)
                OR (c.user1Id = :userB AND c.user2Id = :userA))
            """)
    Optional<Conversation> findExisting(
            @Param("listingId") Long listingId,
            @Param("userA") Long userA,
            @Param("userB") Long userB
    );

    @Query("""
            SELECT c FROM Conversation c
            WHERE (c.user1Id = :userId AND c.deletedByUser1 = false)
                OR (c.user2Id = :userId AND c.deletedByUser2 = false)
            ORDER BY c.lastMessageAt DESC NULLS LAST
            """)
    List<Conversation> findActiveForUser(@Param("userId") Long userId);
}