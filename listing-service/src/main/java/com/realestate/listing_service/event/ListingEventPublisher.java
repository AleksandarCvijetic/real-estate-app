package com.realestate.listing_service.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Salje ListingEvent na Kafku.
 *
 * ListingService NE poziva Kafku direktno, vec objavi interni Spring dogadjaj
 * (ApplicationEventPublisher.publishEvent). Ova metoda ga prihvata tek POSLE
 * uspesnog commit-a transakcije - ako upis u bazu padne (rollback),
 * event se nikad ne salje.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ListingEventPublisher {

    private final KafkaTemplate<String, ListingEvent> kafkaTemplate;

    @Value("${app.kafka.topics.listing-events}")
    private String topic;

    // fallbackExecution = true: ako metoda koja objavljuje dogadjaj nije
    // @Transactional, listener se ipak izvrsava (inace bi event tiho nestao).
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onListingEvent(ListingEvent event) {
        send(event);
    }

    /** Kljuc poruke = listingId, pa svi eventi istog oglasa idu u istu particiju i stizu redom. */
    public void send(ListingEvent event) {
        String key = String.valueOf(event.listingId());
        kafkaTemplate.send(topic, key, event).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Slanje {} eventa za oglas {} nije uspelo", event.eventType(), key, ex);
            } else {
                log.debug("Poslat {} event za oglas {} (particija {})",
                        event.eventType(), key, result.getRecordMetadata().partition());
            }
        });
    }
}