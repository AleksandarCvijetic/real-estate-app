package com.realestate.listing_service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/listings/admin/**").hasRole("ADMIN")
                        // Prijavu salje svaki prijavljen korisnik; pregled i odlucivanje su samo za admina.
                        .requestMatchers(HttpMethod.POST, "/api/listings/report").authenticated()
                        .requestMatchers("/api/listings/report", "/api/listings/report/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,
                                "/api/listings/search",
                                "/api/listings/semantic-search").permitAll()
                        // Detalji oglasa su javni; regex da se ne poklope /my, /report...
                        .requestMatchers(HttpMethod.GET, "/api/listings/{id:\\d+}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/listings/*/images/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}