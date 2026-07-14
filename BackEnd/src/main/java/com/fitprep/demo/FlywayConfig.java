package com.fitprep.demo;

import org.springframework.boot.flyway.autoconfigure.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración para automatizar la reparación de Flyway en el arranque.
 * Si una migración previa falló (como V5 por llave duplicada), 'flyway.repair()'
 * la limpia del historial de la base de datos para permitir que el servidor
 * arranque exitosamente de nuevo con el script corregido.
 */
@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }
}
