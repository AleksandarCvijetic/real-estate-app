package com.realestate.user_service.kafka;

import com.realestate.user_service.event.EmailVerificationRequestedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationEventProducer {

    private static final String TOPIC = "user.verification-requested";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // Salje se tek nakon commit-a, da notification servis nikad ne dobije token koji ne postoji u bazi.
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishVerificationRequested(EmailVerificationRequestedEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event);
        } catch (Exception e) {
            // Korisnik je vec sacuvan; ako Kafka nije dostupna moze da trazi ponovno slanje.
            log.error("Failed to publish verification event for user {}", event.userId(), e);
        }
    }
}
