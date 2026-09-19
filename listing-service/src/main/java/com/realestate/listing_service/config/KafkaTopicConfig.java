package com.realestate.listing_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/** Spring Boot pri startovanju kreira topic ako ne postoji. */
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic listingEventsTopic(@Value("${app.kafka.topics.listing-events}") String name) {
        return TopicBuilder.name(name)
                .partitions(3)
                .replicas(1)
                .build();
    }
}