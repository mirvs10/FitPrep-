package com.fitprep.demo.gestion_usuarios.domain.port.out;

/**
 * Puerto de salida para conocer el tenant activo en la petición en curso.
 * Aísla al dominio del mecanismo (ThreadLocal / contexto de Hibernate).
 */
public interface TenantProviderPort {

    /** Id del negocio activo, o {@code null} si no hay tenant resuelto. */
    Integer currentTenantId();
}
