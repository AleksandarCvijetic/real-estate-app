package com.realestate.messaging_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "blocked_users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"blockerId", "blockedId"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long blockerId;

    @Column(nullable = false)
    private Long blockedId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}