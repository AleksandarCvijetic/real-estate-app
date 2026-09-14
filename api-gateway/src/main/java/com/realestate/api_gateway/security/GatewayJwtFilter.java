package com.realestate.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

@Component
public class GatewayJwtFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/users/auth/"
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        if (isPublicPath(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Long userId = claims.get("userId", Long.class);
            String role = claims.get("role", String.class);

            HeaderMapRequestWrapper wrappedRequest = new HeaderMapRequestWrapper(request);
            wrappedRequest.addHeader("X-User-Id", String.valueOf(userId));
            wrappedRequest.addHeader("X-User-Role", role);

            filterChain.doFilter(wrappedRequest, response);
            return;

        } catch (JwtException | IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }
    }

    private boolean isPublicPath(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (path.startsWith("/api/users/auth/")) {
            return true;
        }

        return "GET".equals(method) && path.startsWith("/api/listings/");
    }
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}