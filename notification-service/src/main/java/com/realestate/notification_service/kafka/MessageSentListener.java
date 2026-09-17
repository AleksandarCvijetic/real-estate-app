package com.realestate.notification_service.kafka;

import com.realestate.notification_service.event.MessageSentEvent;
import com.realestate.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageSentListener {

    private final EmailService emailService;

    @KafkaListener(topics = "message.sent", groupId = "notification-service")
    public void onMessageSent(MessageSentEvent event) {
        emailService.sendNewMessageNotification(event);
    }
}