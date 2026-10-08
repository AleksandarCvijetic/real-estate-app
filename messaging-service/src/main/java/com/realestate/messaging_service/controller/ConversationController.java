package com.realestate.messaging_service.controller;

import com.realestate.messaging_service.dto.ConversationCreateRequest;
import com.realestate.messaging_service.dto.ConversationResponse;
import com.realestate.messaging_service.security.SecurityUtils;
import com.realestate.messaging_service.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messagings/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping
    public ResponseEntity<ConversationResponse> create(@Valid @RequestBody ConversationCreateRequest request) {
        ConversationResponse response = conversationService.create(request, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getMyConversations() {
        return ResponseEntity.ok(conversationService.getMyConversations(SecurityUtils.getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(conversationService.getById(id, SecurityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        conversationService.delete(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}