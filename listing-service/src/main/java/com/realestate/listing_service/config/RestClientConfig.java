package com.realestate.listing_service.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    /**
     * Obican builder. @Primary znaci da ga dobija svako ko trazi RestClient.Builder
     * bez dodatne oznake, ukljucujuci i sam Eureka klijent.
     */
    @Bean
    @Primary
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }

    /**
     * Builder koji ime servisa (npr. http://ai-service) razresava preko Eureka.
     * Dobija ga samo onaj ko ga izricito trazi sa @LoadBalanced (AiServiceClient).
     */
    @Bean
    @LoadBalanced
    public RestClient.Builder loadBalancedRestClientBuilder() {
        return RestClient.builder();
    }
}