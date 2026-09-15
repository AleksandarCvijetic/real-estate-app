package com.realestate.messaging_service.controller;

import com.realestate.messaging_service.dto.MessageCreateRequest;
import com.realestate.messaging_service.dto.MessageResponse;
import com.realestate.messaging_service.security.SecurityUtils;
import com.realestate.messaging_service.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messagings/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> send(
            @PathVariable Long conversationId,
            @Valid @RequestBody MessageCreateRequest request
    ) {
        MessageResponse response = messageService.send(conversationId, request, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getHistory(@PathVariable Long conversationId) {
        return ResponseEntity.ok(messageService.getHistory(conversationId, SecurityUtils.getCurrentUserId()));
    }

    @PatchMapping("/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long conversationId) {
        messageService.markAsRead(conversationId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> countUnread(@PathVariable Long conversationId) {
        long count = messageService.countUnread(conversationId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}