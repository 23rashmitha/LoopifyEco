package com.loopify.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    // 256-bit secret key for HMAC-SHA256
    private static final String SECRET = "LoopifyCampusEnterpriseSecretKey2026ForJWTAuthenticationMustBeLongerThan32Bytes!";
    private static final long EXPIRATION_MS = 86400000; // 24 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email, String role, String userId, String fullName, String departmentId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        claims.put("fullName", fullName);
        claims.put("departmentId", departmentId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return (String) Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
