package com.pajedhow.backend.security;

import com.pajedhow.backend.config.AppProperties;
import com.pajedhow.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final AppProperties props;
    private final SecretKey key;

    public JwtService(AppProperties props) {
        this.props = props;
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(props.getJwt().getSecret()));
    }

    public String generateAccessToken(User user) {
        return buildToken(user, props.getJwt().getAccessTokenExpirationMs());
    }

    public String generateRefreshToken(User user) {
        return buildToken(user, props.getJwt().getRefreshTokenExpirationMs());
    }

    public long getAccessTokenExpirationMs() {
        return props.getJwt().getAccessTokenExpirationMs();
    }

    private String buildToken(User user, long expirationMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(user.getId())
                .issuer(props.getJwt().getIssuer())
                .claims(Map.of(
                        "email", user.getEmail(),
                        "name", user.getName(),
                        "role", user.getRole().name()
                ))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(parseClaims(token));
    }

    public boolean isTokenValid(String token, String userId) {
        try {
            Claims claims = parseClaims(token);
            return userId.equals(claims.getSubject()) && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
