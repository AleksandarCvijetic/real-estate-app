package com.realestate.notification_service.kafka;

import com.realestate.notification_service.event.EmailVerificationRequestedEvent;
import com.realestate.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailVerificationListener {

    private final EmailService emailService;

    // Globalni default type u konfiguraciji je MessageSentEvent, pa ga ovde prepisujemo za ovaj topic.
    @KafkaListener(
            topics = "user.verification-requested",
            groupId = "notification-service",
            properties = "spring.json.value.default.type=com.realestate.notification_service.event.EmailVerificationRequestedEvent"
    )
    public void onVerificationRequested(EmailVerificationRequestedEvent event) {
        emailService.sendVerificationEmail(event);
    }
}
