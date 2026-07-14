package com.fitprep.demo.gestion_usuarios.domain.model;

/**
 * Abstracción de dominio para el hashing de contraseñas. Evita que el modelo
 * dependa de la implementación concreta (BCrypt / Spring Security).
 */
public interface PasswordHasher {

    String hash(String rawPassword);

    boolean matches(String rawPassword, String hashedPassword);
}
