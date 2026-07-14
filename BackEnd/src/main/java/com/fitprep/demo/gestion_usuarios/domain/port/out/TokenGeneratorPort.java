package com.fitprep.demo.gestion_usuarios.domain.port.out;

import java.util.List;

/**
 * Puerto de salida para la generación de tokens de autenticación. El dominio
 * expresa qué necesita (un token) sin conocer JWT ni la librería concreta.
 */
public interface TokenGeneratorPort {

    String generateToken(String subject, List<String> roles, String tenantId);
}
