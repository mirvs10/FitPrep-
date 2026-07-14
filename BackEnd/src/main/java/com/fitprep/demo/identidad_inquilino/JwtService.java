package com.fitprep.demo.identidad_inquilino;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JwtService {

    private static final String SECRET_KEY = "FitprepSuperSecretKeyForJWTAuthThatMustBeLongAndSecure";
    private final Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
    private final JWTVerifier verifier = JWT.require(algorithm).build();

    public String generateToken(String username, List<String> roles, String tenantId) {
        return JWT.create()
                .withSubject(username)
                .withClaim("roles", roles)
                .withClaim("tenantId", tenantId)
                .withExpiresAt(new java.util.Date(System.currentTimeMillis() + 86400000)) // 24h
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String token) throws JWTVerificationException {
        return verifier.verify(token);
    }

    public String getUsername(DecodedJWT decodedJWT) {
        return decodedJWT.getSubject();
    }

    public List<String> getRoles(DecodedJWT decodedJWT) {
        try {
            List<String> roles = decodedJWT.getClaim("roles").asList(String.class);
            return roles != null ? roles : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public String getTenantId(DecodedJWT decodedJWT) {
        try {
            return decodedJWT.getClaim("tenantId").asString();
        } catch (Exception e) {
            return null;
        }
    }
}
