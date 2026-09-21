package com.realestate.listing_service.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    /**
     * @LoadBalanced: RestClient napravljen od ovog builder-a razresava imena servisa
     * (npr. http://ai-service) preko Eureka, kao "lb://" rute u Gateway-u.
     */
    @Bean
    @LoadBalanced
    public RestClient.Builder loadBalancedRestClientBuilder() {
        return RestClient.builder();
    }
}