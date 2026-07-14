package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.security;

import com.fitprep.demo.gestion_usuarios.domain.port.out.TokenGeneratorPort;
import com.fitprep.demo.identidad_inquilino.JwtService;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Adaptador de salida que genera tokens delegando en la infraestructura JWT.
 */
@Component
public class JwtTokenGeneratorAdapter implements TokenGeneratorPort {

    private final JwtService jwtService;

    public JwtTokenGeneratorAdapter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public String generateToken(String subject, List<String> roles, String tenantId) {
        return jwtService.generateToken(subject, roles, tenantId);
    }
}
